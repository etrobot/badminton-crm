import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { BadmintonSession } from "~/types/session";

interface SessionCardProps {
  session: BadmintonSession;
  isMobile?: boolean;
}

export function SessionCard({ session, isMobile = false }: SessionCardProps) {
  // Move date formatting to client-side only using useEffect
  const [formattedDate, setFormattedDate] = React.useState("");
  
  React.useEffect(() => {
    const date = new Date(session.dateTime);
    const formatted = new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
    setFormattedDate(formatted);
  }, [session.dateTime]);

  if (isMobile) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{session.title}</h3>
            <p className="text-sm text-muted-foreground" suppressHydrationWarning>{formattedDate}</p>
          </div>
          <Badge variant="secondary">{session.sessionType}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">教练</p>
            <p>{session.coach}</p>
          </div>
          <div>
            <p className="text-muted-foreground">场地</p>
            <p>{session.courtName} ({session.courtNumber})</p>
          </div>
          <div>
            <p className="text-muted-foreground">器材</p>
            <p>{session.equipment.join(', ')}</p>
          </div>
          <div>
            <p className="text-muted-foreground">学员类型</p>
            <p>{session.clientType}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">学员 ({session.totalClients})</p>
          <div className="flex flex-wrap gap-2">
            {session.clients.map(client => (
              <Badge key={client.id} variant="outline">
                {client.name} (Level {client.level})
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm">编辑</Button>
          <Button variant="destructive" size="sm">删除</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-card hover:bg-muted/50 transition-colors">
      <div className="col-span-3">
        <h3 className="font-medium">{session.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-sm text-muted-foreground" suppressHydrationWarning>{formattedDate}</p>
          <Badge variant="secondary" className="text-xs">{session.sessionType}</Badge>
        </div>
      </div>
      
      <div className="col-span-2 flex items-center">
        <span>{session.coach}</span>
      </div>
      
      <div className="col-span-2 flex items-center">
        <span>{session.courtName} ({session.courtNumber})</span>
      </div>
      
      <div className="col-span-3 flex items-center">
        <div className="flex flex-wrap gap-1">
          {session.clients.map(client => (
            <Badge key={client.id} variant="outline" className="text-xs">
              {client.name}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="col-span-2 flex items-center gap-2">
        <Button variant="outline" size="sm">编辑</Button>
        <Button variant="destructive" size="sm">删除</Button>
      </div>
    </div>
  );
}