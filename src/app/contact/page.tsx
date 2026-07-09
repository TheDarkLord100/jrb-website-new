import Image from "next/image";
import { MapPin, Mail } from "lucide-react";
import PageHeading from "@/components/ui/PageHeading";
import ContactForm from "@/components/sections/ContactForm";

export const metadata = { title: "Contact Us" };

export default function ContactPage() {
  return (
    <div>
      <PageHeading title="Contact Us" />

      <div className="mx-auto grid max-w-[75rem] gap-10 px-5 pb-16 lg:grid-cols-2">
        <div>
          <div className="mb-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-gray-100 bg-white shadow-sm">
            <Image src="/Assets/logos/iit_logo.jpg" alt="IIT Delhi Logo" width={56} height={56} />
          </div>

          <h3 className="text-lg font-bold text-[#001A23]">Indian Institute of Technology, Delhi</h3>

          <p className="mt-4 leading-relaxed text-gray-600">
            The Centre of Excellence (CoE) on BIRD, i.e., Biologically Inspired Robots and Drones,
            at IIT Delhi is an evolution from its humble research activities which began a few
            decades ago by its faculty drawn from the departments of Mechanical Engineering,
            Electrical Engineering, Computer Science and Engineering, and several others.
          </p>

          <ul className="mt-6 flex flex-col gap-4">
            <li>
              <a
                href="https://maps.app.goo.gl/tUt2N4tBYaqqiQbr6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-sm text-gray-700 hover:text-[#001A23]"
              >
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#001A23]" />
                IIT Campus, Hauz Khas, New Delhi, Delhi 110016
              </a>
            </li>
            <li>
              <a
                href="mailto:robotics@iitd.ac.in"
                className="flex items-center gap-3 text-sm text-gray-700 hover:text-[#001A23]"
              >
                <Mail size={18} className="shrink-0 text-[#001A23]" />
                robotics@iitd.ac.in
              </a>
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
