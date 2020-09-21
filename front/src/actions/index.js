export const ModalOpen = 'ModalOpen';
export const ModalClose = 'ModalClose';

export function modal_open(text, topPosition) {
    return {
        type: ModalOpen,
        text, topPosition,
    };
}

export function modal_close() {
    return {
        type: ModalClose,
    };
}
