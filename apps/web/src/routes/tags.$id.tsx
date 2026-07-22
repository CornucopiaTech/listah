
import {
  createFileRoute,
} from '@tanstack/react-router';



import {
  Tags,
  TagShell
} from "@/components/pages/Tags";
import {
  encodeState
} from '@/helpers/encoders';
import {
  DefaultReadRequest,
} from "@/domain/entities";
import {
  TagListProvider
} from "@/hooks/context/tags";



export const Route = createFileRoute('/tags/$id')({
  component: () => <TagListProvider><TagShell><Tags /></TagShell></TagListProvider>,
})
