import { useState, useCallback } from 'react';

export const useTableSelection = (items = [], allIds = null) => {
    const [selectedIds, setSelectedIds] = useState([]);

    const handleSelect = useCallback((id) => {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((item) => item !== id);
            } else {
                return [...prev, id];
            }
        });
    }, []);

    const handleSelectAll = useCallback(() => {
        const targetIds = allIds || items.map((item) => item._id);

        if (selectedIds.length === targetIds.length && targetIds.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(targetIds);
        }
    }, [items, allIds, selectedIds.length]);

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
    }, []);

    const totalCount = allIds ? allIds.length : items.length;
    const isAllSelected = totalCount > 0 && selectedIds.length === totalCount;
    const isIndeterminate = selectedIds.length > 0 && selectedIds.length < totalCount;

    return {
        selectedIds,
        handleSelect,
        handleSelectAll,
        clearSelection,
        isAllSelected,
        isIndeterminate
    };
};
