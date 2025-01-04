import { getPockets } from "@/server/actions/pockets";
import DashboardView from "@/components/views/DashboardView";
import { getUserInfo } from "@/server/actions/auth";
import { getPocketTasks } from "@/server/actions/tasks";
import { Task } from "@/types/models";
import { redirect } from 'next/navigation';

type PageProps = {
    searchParams: Record<string, string | string[] | undefined>;
};

export default async function Home({ searchParams }: PageProps) {
    const user = await getUserInfo();
    const pockets = await getPockets();
    const { pocket: pocketId } = await searchParams;

    let tasks: Task[] = [];

    if (pocketId && typeof pocketId === "string") {
        tasks = await getPocketTasks(pocketId);
    } else if (pockets.length > 0) {
        tasks = await getPocketTasks(pockets[0]._id);
        redirect(`/?pocket=${pockets[0]._id}`);
    }

    return (
        <DashboardView 
            initialData={{
                user,
                pockets,
                tasks,
            }}
        />
    )
}
