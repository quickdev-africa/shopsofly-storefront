import GlobalLayout from "@/components/GlobalLayout";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GlobalLayout>
      {children}
    </GlobalLayout>
  );
}
