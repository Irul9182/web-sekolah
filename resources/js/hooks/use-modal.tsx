import { useCallback, useReducer } from 'react';
export type ModalType = 'create' | 'update' | 'delete' | 'detail';
interface ModalState<T> {
    isOpen: boolean;
    modalType: ModalType | null;
    selectedId: string | null;
    selectedData: T | null;
}

type ModalAction<T> = { type: 'OPEN_MODAL'; modalType: ModalType | null; selectedId: string | null; data: T | null } | { type: 'CLOSE_MODAL' };

function modalReducer<T>(state: ModalState<T>, action: ModalAction<T>): ModalState<T> {
    switch (action.type) {
        case 'OPEN_MODAL':
            return {
                isOpen: true,
                modalType: action.modalType,
                selectedId: action.selectedId,
                selectedData: action.data,
            };
        case 'CLOSE_MODAL':
            return {
                isOpen: false,
                modalType: null,
                selectedId: null,
                selectedData: null,
            };
        default:
            return state;
    }
}

export function useModal<T>() {
    const initialState: ModalState<T> = {
        isOpen: false,
        modalType: null,
        selectedId: null,
        selectedData: null,
    };

    const [state, dispatch] = useReducer(modalReducer<T>, initialState);

    const handleOpenModal = useCallback((selectedId: string | null, modalType: ModalType | null, dataSource: T[] | undefined) => {
        const findData = dataSource?.find((item: any) => item.id === selectedId) || null;

        dispatch({
            type: 'OPEN_MODAL',
            modalType,
            selectedId,
            data: findData,
        });
    }, []);

    const handleCloseModal = useCallback(() => {
        dispatch({ type: 'CLOSE_MODAL' });
    }, []);

    return {
        ...state,
        handleOpenModal,
        handleCloseModal,
    };
}
