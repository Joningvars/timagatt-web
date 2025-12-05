import { Loader } from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex w-full items-center justify-center h-[calc(100vh-8rem)]">
      <Loader />
    </div>
  );
}
