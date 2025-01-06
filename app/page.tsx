import { getPockets } from "@/server/actions/pockets";
import DashboardView from "@/components/views/DashboardView";
import { getUserInfo } from "@/server/actions/auth";
import { getPocketTasks } from "@/server/actions/tasks";
import { Task } from "@/types/models";
import { redirect } from 'next/navigation';

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
};

export default async function Home({ searchParams }: PageProps) {
    const userData = await getUserInfo();
    const pocketsData = await getPockets();
    const { pocket: pocketId } = await searchParams;

    const getTasks = async (id: string) => {
        const tasksData = await getPocketTasks(id);
        return tasksData?.tasks || [];
    };

    if (!userData || !pocketsData) return null;

    const { user } = userData;
    const { pockets } = pocketsData;
    let tasks: Task[] = [];

    if (pocketId && typeof pocketId === "string") {
        tasks = await getTasks(pocketId);
    } else if (pockets && pockets.length > 0) {
        const firstPocketId = pockets[0]._id;
        tasks = await getTasks(firstPocketId);
        redirect(`/?pocket=${pockets[0]._id}`);
    }

    if (user && pockets) {
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
}
