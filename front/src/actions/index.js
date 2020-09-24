export const ModalOpen = 'ModalOpen';
export const ModalClose = 'ModalClose';

export const LeftSwipe = 'LeftSwipe';
export const RightSwipe = 'RightSwipe';
export const ClickLink = 'ClickLink';

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


export function left_swipe(nowPage) {
    return {
        type: LeftSwipe,
        nowPage,
    }
}

export function right_swipe(nowPage) {
    return {
        type: RightSwipe,
        nowPage,
    }
}

export function click_link(nowPage) {
    return {
        type: ClickLink,
        nowPage,
    }
}