"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";

export interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
}

interface ListProps {
    items: Todo[];
}

const List: React.FC<ListProps> = props => {
    const [todos, setTodos] = React.useState<Todo[]>(props.items);
    const [selectedTodo, setSelectedTodo] = useState<Todo>();

    // ! خیلی خسته بودم میدونم خیلی جای بهینه سازی هست هم برای ذخیره سازی در کوکی هم برای موارد دیگه
    const saveTodos = useCallback((todos: Todo[]) => {
        Cookies.set("todos", JSON.stringify(todos));
    }, []);

    useEffect(() => {
        setTodos(JSON.parse(Cookies.get("todos") || "[]"));
    }, []);

    return (
        <div className="flex flex-col">
            <AdderSection
                onAddTodo={newTodo => {
                    const newTodos = [...todos, newTodo];
                    setTodos(newTodos);
                    saveTodos(newTodos);
                    console.log(newTodo);
                }}
                onEditTodo={updatedTodo => {
                    const newTodos = todos.map(todo =>
                        todo.id === updatedTodo.id ? updatedTodo : todo
                    );
                    setTodos(newTodos);
                    saveTodos(newTodos);
                }}
                selectedItem={selectedTodo}
            />
            <ul className=" gap-2 flex flex-col max-h-28 overflow-y-auto overflow-x-hidden">
                {todos.map(todo => {
                    return (
                        <Item
                            key={todo.id}
                            onCheck={status => {
                                const newTodos = todos.map(t => {
                                    if (t.id === todo.id) {
                                        return {
                                            ...t,
                                            completed: status,
                                        };
                                    }
                                    return t;
                                });
                                setTodos(newTodos);
                                saveTodos(newTodos);
                            }}
                            onDelete={() => {
                                const newTodos = todos.filter(
                                    t => t.id !== todo.id
                                );
                                setTodos(newTodos);
                                saveTodos(newTodos);
                            }}
                            onEdit={() => {
                                setSelectedTodo(todo);
                            }}
                            todo={todo}
                        />
                    );
                })}
            </ul>
        </div>
    );
};

interface ItemProps {
    todo: Todo;
    onCheck?: (status: boolean) => void;
    onDelete?: React.MouseEventHandler<HTMLButtonElement>;
    onEdit?: React.MouseEventHandler<HTMLButtonElement>;
}

function Item({ todo, onCheck, onDelete, onEdit }: ItemProps) {
    return (
        <li className="flex flex-row-reverse bg-green-700 gap-2 px-3 py-1 rounded-lg hover:scale-105 transition-transform cursor-pointer">
            <label htmlFor="ch">
                <input
                    placeholder="checkbox"
                    type="checkbox"
                    onChange={e => {
                        if (onCheck) onCheck(e.target.checked);
                    }}
                />
            </label>
            {todo.title}
            <button className="bg-red-600 w-5 h-5 mr-auto" onClick={onDelete}>
                -
            </button>
            <button
                className="bg-green-800 ring-1 ring-white h-5"
                onClick={onEdit}
            >
                ویرایش
            </button>
        </li>
    );
}

interface AdderSectionProps {
    onAddTodo: (todo: Todo) => void;
    onEditTodo: (todo: Todo) => void;
    selectedItem?: Todo;
}

function AdderSection(props: AdderSectionProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedItem, setSelectedItem] = useState(
        props.selectedItem ?? undefined
    );

    const isNew = useMemo(() => {
        const result = !selectedItem;
        if (selectedItem) {
            setTitle(selectedItem.title);
            setDescription(selectedItem.description);
        } else {
            setTitle("");
            setDescription("");
        }
        return result;
    }, [selectedItem]);

    useEffect(() => {
        setSelectedItem(props.selectedItem);
    }, [props.selectedItem]);

    return (
        <div className="flex justify-center items-center">
            <div className="flex flex-col gap-2 m-1 outline-none p-1 text-black">
                <input
                    placeholder="Add a todo title"
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <input
                    placeholder="Add a todo"
                    type="text"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                />
            </div>
            <button
                className=" bg-green-800 rounded-lg  w-10 h-10"
                onClick={() => {
                    if (!selectedItem) {
                        props.onAddTodo({
                            title,
                            description,
                            completed: false,
                            id: Date.now(),
                        });
                    } else {
                        props.onEditTodo({
                            title,
                            description,
                            completed: false,
                            id: selectedItem.id,
                        });
                    }
                }}
            >
                {!isNew ? "ویرایش" : "اضافه"}
            </button>
            <button
                onClick={() => {
                    setSelectedItem(undefined);
                }}
            >
                جدید
            </button>
        </div>
    );
}

export default List;
