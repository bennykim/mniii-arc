import { GroupManagement } from "@/widgets/GroupManagement";

const DashboardPage = () => {
  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      <GroupManagement />
    </div>
  );
};

export default DashboardPage;
