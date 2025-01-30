import Brands from "@/components/Brands";
import Footer from "@/components/Footer";
import ForAuthors from "@/components/ForAuthors";
import Header from "@/components/Header";

const ethics = () => {
  return (
    <div className="">
      <Header />
      <div className="flex flex-col lg:flex-row h-full w-full">
        {/* Left Content */}
        <div className="w-full lg:w-[60%] p-4 lg:p-10">
          <h1 className="text-2xl font-bold mb-4">Publication Ethics</h1>
          <p className="mb-4">
            The publication of an article in a peer-reviewed journal is a direct reflection of the quality of the work of the authors.
            Peer-reviewed articles improve the quality of publication and enhance scientific techniques.
            Hence all parties involved in the act of publishing: the author, the journal editor, the peer reviewer, the publisher should follow the publication ethics.
          </p>

          <h1 className="text-xl font-[500]">Responsibilities of the Publisher</h1>
          <ol className="list-disc ml-10 mb-4">
            <li>The important role of the publisher is to appoint an Editor-In-Chief for the journal and also support the efforts made by them in maintaining the integrity of the scholarly record.</li>
            <li>In proper communication with Editor-In-Chief of journal, publisher may invite guest or executive editor to publish special issues or conference proceedings in the journal.</li>
            <li>We are committed to ensuring that the potential for advertising, reprint or other commercial revenue has no impact or influence on editorial decisions.</li>
          </ol>

          <h1 className="text-xl font-[500]">Responsibilities of Editor in Chief and Editorial Board Members</h1>
          <ol className="list-disc ml-10 mb-4">
            <li>Editor in Chief with assigned editorial board members shall responsible for changes require in content and template of the manuscripts submitted to the journal.</li>
            <li>Submitted review/research manuscript must be reviewed by double blind review process, and if required editor can take additional opinion. The editor shall ensure that the peer review process is fair, unbiased, and timely.</li>
            <li>All submitted manuscript for review must keep as confidence and do not disclose any information to anyone other than the corresponding author, reviewers and the publisher.</li>
            <li>Editor-In-Chief cannot publish his own review/research paper in the journal and must not be involved in decisions about papers written by family members.</li>
            <li>Editors shall conduct proper and fair investigation into ethical complaints.</li>
          </ol>

          <h1 className="text-xl font-[500]">Responsibility of Reviewers</h1>
          <ol className="list-disc ml-10 mb-4">
            <li>Revive process must keep as confidential by the reviewer and manuscript received for review or information about the paper must not share with anyone.</li>
            <li>Reviewers should provide details of review and his opinion about paper with supporting arguments in the format provided by editor.</li>
            <li>Reviewers should complete their reviews within the journal stipulated timeframe.</li>
            <li>Reviewers should not review manuscripts in which they have conflicts of interest resulting from competitive, collaborative, or other relationships or connections with any of the authors, companies, or institutions connected to the papers.</li>
          </ol>

          <h1 className="text-xl font-[500]">Responsibilities of Authors</h1>
          <ol className="list-disc ml-10 mb-4">
            <li>All manuscripts must be the original work of authors and not plagiarism.</li>
            <li>Authors must accept an authorship of a manuscript and should have significant contributions from all authors.</li>
            <li>Authors must appropriately and precisely recognize the work of others.</li>
            <li>Authors should clearly mention any financial or other substantive conflict of interest that may impact the results or interpretation of their manuscript and acknowledge individuals or organizations that have provided financial support for research.</li>
            <li>Authors may be asked to provide additional content or material related to submitted manuscripts during peer review which is required to open publicly if possible.</li>
            <li>All manuscripts must be previously unpublished, and not under consideration for publication elsewhere.</li>
          </ol>
        </div>

        {/* Right Content */}
        <div className="w-full lg:w-[40%] flex flex-col items-center px-4 lg:px-10 pt-10 gap-10">
          <ForAuthors />
          <Brands />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ethics;
