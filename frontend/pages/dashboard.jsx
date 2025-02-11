import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/utils/auth";

const Dashboard = () => {
  const router = useRouter();
  const {user} = useAuth()
  console.log(user)

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-semibold mb-6">Welcome, {user.username}</h1>
      {user.role === "author" && <AuthorDashboard />}
      {user.role === "editor" && <EditorDashboard />}
      {user.role === "reviewer" && <ReviewerDashboard />}
    </div>
  );
};

const AuthorDashboard = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Author Dashboard</h2>
    <div className="space-y-4">
      <Link href="/submit-paper" className="block bg-blue-500 text-white px-4 py-2 rounded">Submit New Paper</Link>
      <Link href="/my-submissions" className="block bg-gray-200 px-4 py-2 rounded">View My Submissions</Link>
      <Link href="/revision-requests" className="block bg-yellow-500 text-white px-4 py-2 rounded">Respond to Revisions</Link>
      <Link href="/track-status" className="block bg-green-500 text-white px-4 py-2 rounded">Track Submission Status</Link>
    </div>
  </div>
);

const EditorDashboard = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Editor Dashboard</h2>
    <div className="space-y-4">
      <Link href="/manage-submissions" className="block bg-green-500 text-white px-4 py-2 rounded">Manage Submissions</Link>
      <Link href="/assign-reviewers" className="block bg-gray-200 px-4 py-2 rounded">Assign Reviewers</Link>
      <Link href="/review-progress" className="block bg-purple-500 text-white px-4 py-2 rounded">Monitor Review Progress</Link>
      <Link href="/approve-papers" className="block bg-blue-500 text-white px-4 py-2 rounded">Approve or Reject Papers</Link>
      <Link href="/manage-revisions" className="block bg-yellow-500 text-white px-4 py-2 rounded">Request Revisions</Link>
    </div>
  </div>
);

const ReviewerDashboard = () => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-semibold mb-4">Reviewer Dashboard</h2>
    <div className="space-y-4">
      <Link href="/pending-reviews" className="block bg-yellow-500 text-white px-4 py-2 rounded">Pending Reviews</Link>
      <Link href="/completed-reviews" className="block bg-gray-200 px-4 py-2 rounded">Completed Reviews</Link>
      <Link href="/review-guidelines" className="block bg-blue-500 text-white px-4 py-2 rounded">Review Guidelines</Link>
      <Link href="/submit-feedback" className="block bg-green-500 text-white px-4 py-2 rounded">Submit Feedback</Link>
      <Link href="/review-history" className="block bg-purple-500 text-white px-4 py-2 rounded">Review History</Link>
    </div>
  </div>
);

export default Dashboard;
