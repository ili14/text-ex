import List, { Todo } from "@/components/List/List";

const initTodos: Todo[] = [
    {
        id: 1,
        completed: false,
        title: "test title",
        description: "test description",
    },
];

export default function Home() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex bg-gray-400 p-5 rounded-lg">
                <List items={initTodos} />
            </div>
        </div>
    );
}
