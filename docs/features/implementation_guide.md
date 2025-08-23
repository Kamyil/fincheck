# Feature Implementation Guide

This document provides guidelines for implementing new features in the Pan Samochodzik platform, using the application's established patterns with SvelteKit 2.0 and Svelte 5.

## Implementation Process

### 1. Planning Phase

- **Feature Definition**: Clearly define the feature scope, user stories, and acceptance criteria
- **Data Modeling**: Design the necessary database schema changes
- **Component Design**: Plan the UI components and user flow
- **API Planning**: Define the required remote functions (queries, forms, commands)

### 2. Database Schema Implementation

For features requiring database changes:

```typescript
// Example schema addition in src/lib/server/db/schema.ts
import { pgTable, integer, text, timestamp, varchar, pgEnum } from 'drizzle-orm/pg-core';
import { user } from './schema'; // existing schema

// Define new schema elements
export const vehicle = pgTable('vehicles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id),
  make: varchar('make', { length: 100 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  year: integer('year').notNull(),
  vin: varchar('vin', { length: 17 }),
  registration: varchar('registration', { length: 20 }),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at')
});

export type Vehicle = typeof vehicle.$inferSelect;
```

Then create a migration:

```bash
npm run db:generate -- --name add_vehicles_table
```

### 3. Remote Functions Implementation

Create a new remote functions file in the appropriate domain folder:

```typescript
// Example: src/lib/vehicles/data.remote.ts
import { form, query, command } from '$app/server';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import * as schema from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { auth } from '$lib/server/auth';

// Get user vehicles
export const getUserVehicles = query(async (event) => {
  const session = await auth.getSession(event);
  
  if (!session) {
    error(401, 'Unauthorized');
  }
  
  try {
    const vehicles = await db.select()
      .from(schema.vehicle)
      .where(eq(schema.vehicle.userId, session.userId));
      
    return vehicles;
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    error(500, 'Failed to fetch vehicles');
  }
});

// Add new vehicle
export const addVehicle = form(async (data, event) => {
  const session = await auth.getSession(event);
  
  if (!session) {
    error(401, 'Unauthorized');
  }
  
  const make = data.get('make');
  const model = data.get('model');
  const year = data.get('year');
  
  // Validate input
  if (typeof make !== 'string' || typeof model !== 'string' || !year) {
    return { success: false, error: 'Invalid vehicle data' };
  }
  
  try {
    const id = crypto.randomUUID();
    
    await db.insert(schema.vehicle).values({
      id,
      userId: session.userId,
      make,
      model,
      year: parseInt(year.toString(), 10),
      vin: data.get('vin')?.toString() || null,
      registration: data.get('registration')?.toString() || null,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Refresh query to update UI
    await getUserVehicles().refresh();
    
    return { success: true, id };
  } catch (err) {
    console.error('Error adding vehicle:', err);
    return { success: false, error: 'Failed to add vehicle' };
  }
});
```

### 4. Component Implementation

Create necessary Svelte components following the application's UI patterns:

```svelte
<!-- Example: src/routes/vehicles/+page.svelte -->
<script lang="ts">
  import { getUserVehicles, addVehicle } from '$lib/vehicles/data.remote';
  import Button from '$lib/components/common/Button.svelte';
  import Table from '$lib/components/common/Table/Table.svelte';
  import TableHeader from '$lib/components/common/Table/TableHeader.svelte';
  import TableBody from '$lib/components/common/Table/TableBody.svelte';
  import TableRow from '$lib/components/common/Table/TableRow.svelte';
  import TableCell from '$lib/components/common/Table/TableCell.svelte';
  import TableHeading from '$lib/components/common/Table/TableHeading.svelte';
  
  let showAddForm = $state(false);
</script>

<svelte:boundary>
  <div class="container mx-auto p-8">
    <h1 class="mb-6 text-3xl font-bold">Your Vehicles</h1>
    
    <Button 
      variant="blue" 
      onClick={() => showAddForm = true}
      class="mb-6"
    >
      Add New Vehicle
    </Button>
    
    {#key getUserVehicles().current}
      {@const vehicles = await getUserVehicles()}
      
      {#if vehicles.length > 0}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeading>Make</TableHeading>
              <TableHeading>Model</TableHeading>
              <TableHeading>Year</TableHeading>
              <TableHeading>Registration</TableHeading>
              <TableHeading>Actions</TableHeading>
            </TableRow>
          </TableHeader>
          <TableBody>
            {#each vehicles as vehicle}
              <TableRow>
                <TableCell>{vehicle.make}</TableCell>
                <TableCell>{vehicle.model}</TableCell>
                <TableCell>{vehicle.year}</TableCell>
                <TableCell>{vehicle.registration || '-'}</TableCell>
                <TableCell>
                  <Button variant="blue" size="small">Details</Button>
                </TableCell>
              </TableRow>
            {/each}
          </TableBody>
        </Table>
      {:else}
        <div class="rounded-lg border border-gray-700 bg-gray-900 p-6 text-center">
          <p class="text-gray-400">You don't have any vehicles yet.</p>
          <p class="mt-2 text-sm">Add your first vehicle to get started.</p>
        </div>
      {/if}
    {/key}
    
    <!-- Add Vehicle Form Modal -->
    {#if showAddForm}
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="w-full max-w-md rounded-lg border border-gray-700 bg-gray-900 p-6">
          <h2 class="mb-4 text-2xl font-bold text-white">Add New Vehicle</h2>
          
          <form {...addVehicle}>
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-gray-300">
                Make
                <input
                  name="make"
                  required
                  class="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-4 py-2"
                />
              </label>
            </div>
            
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-gray-300">
                Model
                <input
                  name="model"
                  required
                  class="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-4 py-2"
                />
              </label>
            </div>
            
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-gray-300">
                Year
                <input
                  name="year"
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  class="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-4 py-2"
                />
              </label>
            </div>
            
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-gray-300">
                Registration Number (optional)
                <input
                  name="registration"
                  class="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-4 py-2"
                />
              </label>
            </div>
            
            <div class="mb-4">
              <label class="mb-2 block text-sm font-medium text-gray-300">
                VIN (optional)
                <input
                  name="vin"
                  class="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-4 py-2"
                />
              </label>
            </div>
            
            <div class="mt-6 flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="gray" 
                onClick={() => showAddForm = false}
              >
                Cancel
              </Button>
              <Button type="submit" variant="blue">Add Vehicle</Button>
            </div>
          </form>
          
          {#if addVehicle.result?.success}
            <div class="mt-4 rounded bg-green-100 p-3 text-green-800">
              Vehicle added successfully!
            </div>
          {:else if addVehicle.result?.error}
            <div class="mt-4 rounded bg-red-100 p-3 text-red-800">
              {addVehicle.result.error}
            </div>
          {/if}
        </div>
      </div>
    {/if}
  </div>

  {#snippet pending()}
    <div class="container mx-auto flex items-center justify-center p-8">
      <div class="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-600"></div>
    </div>
  {/snippet}
</svelte:boundary>
```

### 5. Navigation and Routing

Update the navigation to include links to the new feature:

```svelte
<!-- Add to src/routes/+layout.svelte or the appropriate navigation component -->
<SidebarItem href="/vehicles">
  <Car slot="icon" />
  <span>Vehicles</span>
</SidebarItem>
```

### 6. Testing

- **Unit Tests**: Test remote functions and utility code
- **Component Tests**: Test UI components and interactions
- **End-to-End Tests**: Test complete user flows

### 7. Documentation

Update documentation to include the new feature:

- Add user documentation in `docs/features/`
- Update developer documentation if necessary
- Include usage examples and screenshots

## Best Practices

1. **Use TypeScript** for type safety
2. **Follow existing patterns** for consistency
3. **Use remote functions** for data operations
4. **Validate all user input** on the server
5. **Add proper error handling** for robustness
6. **Use `<svelte:boundary>` with async components** for better UX
7. **Keep components small and focused**
8. **Follow the established UI design language**

By following these guidelines, new features can be implemented consistently with the rest of the Pan Samochodzik platform.
