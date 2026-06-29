import { fetchFred } from "@/lib/dev/live/fred";
import { BuildPropertyClient } from "@/components/BuildPropertyClient";

export const metadata = { title: "Build a property" };

/** Underwriting Lab: define any property and model the deal live. The FRED
 *  30-yr mortgage rate + construction-cost multiplier are fetched live here
 *  (server) and handed to the client form, which holds all editable inputs. */
export default async function BuildPage() {
  const fred = await fetchFred();
  return (
    <BuildPropertyClient
      mortgageRate={fred.mortgageRate}
      costMultiplier={fred.costMultiplier}
    />
  );
}
