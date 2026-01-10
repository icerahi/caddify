import { PricingTable } from "@clerk/nextjs";

export default function PricingPage() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 1rem" }}>
      <h2 className="my-10 text-center text-3xl font-bold">Pricing Plans</h2>
      <PricingTable />
    </div>
  );
}
