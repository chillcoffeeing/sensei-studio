<script lang="ts">
  import type { AccordionImage } from './accordion';

  interface Props {
    image: AccordionImage;
    /** `sizes` de la imagen (lo decide ServicesAccordion). */
    sizes: string;
  }

  let { image, sizes }: Props = $props();
</script>

<!-- Formatos modernos primero (avif, webp) y JPG de respaldo; el <li> que la recorta lo pone ServiceRow. -->
<picture>
  {#each image.sources as source (source.type)}
    <source type={source.type} srcset={source.srcset} {sizes} />
  {/each}
  <img
    src={image.src}
    srcset={image.srcset}
    {sizes}
    width={image.width}
    height={image.height}
    alt={image.alt}
    loading="lazy"
    decoding="async"
    class="block size-full object-cover"
  />
</picture>
