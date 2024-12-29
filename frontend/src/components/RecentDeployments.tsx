import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Deployment {
  id: string;
  project: string;
  commitMessage: string;
  commitHash: string;
  timestamp: string;
}

const recentDeployments: Deployment[] = [
  {
    id: "1",
    project: "Project A",
    commitMessage: "Update README.md",
    commitHash: "a1b2c3d",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    project: "Project B",
    commitMessage: "Fix login bug",
    commitHash: "e4f5g6h",
    timestamp: "4 hours ago",
  },
  {
    id: "3",
    project: "Project C",
    commitMessage: "Add new feature",
    commitHash: "i7j8k9l",
    timestamp: "1 day ago",
  },
];

export function RecentDeployments() {
  return (
    <div className="space-y-8">
      {recentDeployments.map((deployment) => (
        <div key={deployment.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/${deployment.id}.png`} alt="Avatar" />
            <AvatarFallback>{deployment.project[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {deployment.project}
            </p>
            <p className="text-sm text-muted-foreground">
              {deployment.commitMessage} ({deployment.commitHash})
            </p>
          </div>
          <div className="ml-auto font-medium">{deployment.timestamp}</div>
        </div>
      ))}
    </div>
  );
}
