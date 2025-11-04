import { formatToRupiah } from '@/libs/rupiahFormatter';
import { terbilangUang } from '@/libs/terbilangUang';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $formatToRupiah: typeof formatToRupiah;
    $terbilangUang: typeof terbilangUang;
  }
}
