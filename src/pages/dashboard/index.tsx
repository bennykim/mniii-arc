import { GroupManagement } from "@/widgets/GroupManagement";

function DashboardPage() {
  return (
    <div className="h-screen bg-gradient-to-t from-yellow-50 to-blue-600">
      <div className="container p-4 mx-auto">
        <GroupManagement />
      </div>
    </div>
  );
}

export default DashboardPage;
