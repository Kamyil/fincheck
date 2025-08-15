<script lang="ts">
    import { twMerge } from "tailwind-merge";

    interface Props {
        classes?: string;
    }

    let { classes = "" }: Props = $props();
</script>

<svg
    class={twMerge(classes)}
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 14.524 14.524"
>
    <g
        id="unlock"
        transform="translate(-1.25 -1.25)"
        fill-rule="evenodd"
        clip-rule="evenodd"
        stroke-width="0.1"
    >
        <path
            id="Path_670"
            data-name="Path 670"
            d="M11.89,18.37H5.134c-2.979,0-3.884-.905-3.884-3.884V13.134c0-2.979.905-3.884,3.884-3.884H11.89c2.979,0,3.884.905,3.884,3.884v1.351C15.774,17.465,14.869,18.37,11.89,18.37ZM5.134,10.263c-2.418,0-2.871.459-2.871,2.871v1.351c0,2.412.453,2.871,2.871,2.871H11.89c2.418,0,2.871-.459,2.871-2.871V13.134c0-2.412-.453-2.871-2.871-2.871Z"
            transform="translate(0 -2.596)"
            fill="#848484"
        />
        <path
            id="Path_671"
            data-name="Path 671"
            d="M5.757,7.668a.51.51,0,0,1-.507-.507V5.81c0-1.959.473-4.56,4.56-4.56,3.026,0,4.56,1.3,4.56,3.884a.507.507,0,0,1-1.013,0c0-1.338-.405-2.871-3.547-2.871-2.945,0-3.547,1.419-3.547,3.547V7.161A.51.51,0,0,1,5.757,7.668Z"
            transform="translate(-1.298)"
            fill="#848484"
        />
        <path
            id="Path_672"
            data-name="Path 672"
            d="M10.945,17.141a2.2,2.2,0,1,1,2.2-2.2A2.2,2.2,0,0,1,10.945,17.141Zm0-3.378a1.182,1.182,0,1,0,1.182,1.182A1.188,1.188,0,0,0,10.945,13.763Z"
            transform="translate(-2.433 -3.731)"
            fill="#848484"
        />
    </g>
</svg>
