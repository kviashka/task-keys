import { useState } from 'react';
import { IItem } from './index';

export function Keys(props: { initialData: IItem[]; sorting: 'ASC' | 'DESC' }) {
    // 1. Состояние для списка элементов (копируем initialData, чтобы не менять пропсы)
    const [items, setItems] = useState<IItem[]>(props.initialData);

    // 2. Состояние для ID элемента, который сейчас редактируется
    const [editingId, setEditingId] = useState<number | null>(null);

    // 3. Состояние для временного значения в инпуте (чтобы можно было отменить по Escape)
    const [editingValue, setEditingValue] = useState<string>('');

    // Сортируем элементы для отображения в зависимости от пропса sorting
    // Используем копию массива [...items], чтобы не мутировать исходный стейт
    const sortedItems = [...items].sort((a, b) => {
        return props.sorting === 'ASC' ? a.id - b.id : b.id - a.id;
    });

    // Обработчик клика по имени (начало редактирования)
    const startEditing = (item: IItem) => {
        setEditingId(item.id);
        setEditingValue(item.name);
    };

    // Обработчик нажатия клавиш в инпуте
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Сохраняем изменения
            setItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === editingId
                        ? { ...item, name: editingValue }
                        : item,
                ),
            );
            setEditingId(null); // Выходим из режима редактирования
        } else if (e.key === 'Escape') {
            // Отменяем изменения
            setEditingId(null);
        }
    };

    return (
        <div>
            {sortedItems.map((item) => (
                <div key={item.id} style={{ margin: '10px 0' }}>
                    {editingId === item.id ? (
                        // Если элемент редактируется, показываем инпут
                        <input
                            type="text"
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            autoFocus // Автоматически ставим курсор в инпут
                        />
                    ) : (
                        // Иначе показываем просто текст, по клику на который начинается редактирование
                        <span
                            onClick={() => startEditing(item)}
                            style={{
                                cursor: 'pointer',
                                borderBottom: '1px dashed gray',
                            }}
                        >
                            {item.name}
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
