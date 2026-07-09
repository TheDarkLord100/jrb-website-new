import PageHeading from "@/components/ui/PageHeading";
import AdmissionAnnouncements from "@/components/sections/AdmissionAnnouncements";

export const metadata = { title: "Admissions" };

const processBlocks = [
  {
    title: "Important Announcements",
    body: (
      <>
        <ul className="list-disc pl-5 text-gray-700">
          <li>
            <strong>Shortlisting Criteria for M.Tech in Robotics (2026–27):</strong>{" "}
            <a
              href="/Assets/selection_criteria_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#001A23] underline underline-offset-2"
            >
              View Document
            </a>
          </li>
        </ul>
        <p className="mt-3 leading-relaxed text-gray-700">
          All shortlisted candidates should have received a call letter via email. If you believe
          you meet the shortlisting criteria but did not receive one, please check your spam folder
          and verify that your application number appears in the shortlist:{" "}
          <a
            href="/Assets/shortlisted_2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#001A23] underline underline-offset-2"
          >
            View Shortlisted Candidates
          </a>
          .
        </p>
        <p className="mt-3 leading-relaxed text-gray-700">
          If eligible but not listed or if you did not receive a call letter, write to{" "}
          <strong>robotics@iitd.ac.in</strong> with your application number, GATE details, and
          qualifying degree.
        </p>
      </>
    ),
  },
  {
    title: "Selection Schedule",
    body: (
      <ul className="list-disc pl-5 text-gray-700">
        <li>
          <strong>Test Date:</strong> May 2, 2026
        </li>
        <li>
          <strong>Reporting Time:</strong> 8:30 AM
        </li>
        <li>
          <strong>Venue:</strong> Control Lab (EE Dept.), Room 214, Block 2, IIT Delhi
        </li>
      </ul>
    ),
  },
  {
    title: "Selection Process",
    body: (
      <>
        <p className="leading-relaxed text-gray-700">
          The selection process consists of a Programming Aptitude Test (PAT) followed by an
          interview. Only candidates who qualify the PAT will proceed to interviews.
        </p>
        <p className="mt-3 leading-relaxed text-gray-700">
          Interviews will begin on the afternoon of May 2 and may continue through May 3.
          Scheduling for outstation candidates will consider travel constraints where possible.
        </p>
      </>
    ),
  },
  {
    title: "Travel & Accommodation",
    body: (
      <p className="leading-relaxed text-gray-700">
        Candidates are requested to make their own travel and accommodation arrangements. IIT
        Delhi will not provide lodging or TA/DA.
      </p>
    ),
  },
  {
    title: "Documents to Carry",
    body: (
      <ul className="list-disc pl-5 text-gray-700">
        <li>Government-issued photo ID (original + copy)</li>
        <li>Application acknowledgement</li>
        <li>GATE scorecard</li>
        <li>Academic certificates and transcripts</li>
        <li>Category certificate (if applicable)</li>
        <li>
          <strong>For part-time candidates:</strong> NOC from employer (mandatory for eligibility)
        </li>
      </ul>
    ),
  },
  {
    title: "About the Programming Aptitude Test (PAT)",
    body: (
      <p className="leading-relaxed text-gray-700">
        The PAT evaluates mathematical aptitude, logical reasoning, problem-solving, and
        computational thinking. Candidates should have basic programming knowledge in C, C++, or
        Python.
      </p>
    ),
  },
  {
    title: "PAT Results & Interview Schedule",
    body: (
      <>
        <p className="leading-relaxed text-gray-700">
          PAT results will be published on this page and displayed at the venue by{" "}
          <strong>1:00 PM, May 2, 2026</strong>.
        </p>
        <p className="mt-3 leading-relaxed text-gray-700">
          Shortlisted candidates must report to <strong>LH602 by 2:00 PM</strong>. Interviews may
          continue into May 3.
        </p>
      </>
    ),
  },
  {
    title: "Admission Offers & Final Steps",
    body: (
      <ul className="list-disc pl-5 text-gray-700">
        <li>Admission offers are released through the COAP (Common Offer Acceptance Portal).</li>
        <li>Candidates must register separately on COAP.</li>
        <li>
          After accepting an offer, candidates must complete the final admission formalities on the
          IIT Delhi PG Admissions Portal, including document submission and fee payment.
        </li>
      </ul>
    ),
  },
];

const importantLinks = [
  { label: "IITD Scorner Portal", href: "https://ecampus.iitd.ac.in/scorner/login" },
  { label: "IITD PG Admission Portal", href: "http://ecampus.iitd.ac.in/PGADM/login" },
  { label: "IIT Delhi Home", href: "https://home.iitd.ac.in/" },
  { label: "COAP 2026 Portal", href: "https://coap2026.iitr.ac.in/coap2026/" },
];

export default function AdmissionsPage() {
  return (
    <div>
      <PageHeading title="Admissions" />

      <div className="mx-auto grid max-w-[75rem] gap-8 px-5 pb-16 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#001A23]">
              Admissions to M.Tech in Robotics (JRB) at IIT Delhi (2026–27)
            </h2>
            <p className="mt-3 text-sm text-gray-600">
              <strong>All admissions-related announcements will be made on this page.</strong>
              <br />
              <span className="text-xs text-gray-400">Last updated: April 24, 2026</span>
            </p>

            <div className="mt-6 flex flex-col divide-y divide-gray-100">
              {processBlocks.map((block) => (
                <div key={block.title} className="py-5 first:pt-0 last:pb-0">
                  <h3 className="font-semibold text-[#001A23]">{block.title}</h3>
                  <div className="mt-2 text-sm">{block.body}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-[#001A23]">Important Links</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {importantLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-200 px-4 py-3 text-sm font-medium text-[#001A23] transition-colors hover:border-[#001A23] hover:bg-gray-50"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <aside>
          <AdmissionAnnouncements />
        </aside>
      </div>
    </div>
  );
}
