import { Suspense } from "react";

type Props = {
  condition: () => Promise<boolean>;
  children: React.ReactNode;
  loadingFallback?: React.ReactNode;
  otherwise?: React.ReactNode;
};

export const AsyncIf = ({
  condition,
  children,
  loadingFallback,
  otherwise,
}: Props) => {
  return (
    <Suspense fallback={loadingFallback}>
      <SuspendedComponent condition={condition} otherwise={otherwise}>
        {children}
      </SuspendedComponent>
    </Suspense>
  );
};

const SuspendedComponent = async ({
  children,
  condition,
  otherwise,
}: Omit<Props, "loadingFallback">) => {
  return (await condition()) ? children : otherwise;
};
