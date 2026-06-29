import { redirect } from "next/navigation";

/** Methodology now lives on the single, site-wide About page. */
export default function StudentHousingAboutRedirect() {
  redirect("/about");
}
