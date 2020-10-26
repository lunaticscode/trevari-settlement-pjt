export const ModalOpen = 'ModalOpen';
export const ModalClose = 'ModalClose';

export const LeftSwipe = 'LeftSwipe';
export const RightSwipe = 'RightSwipe';
export const ClickLink = 'ClickLink';

export const MaskOpen = 'MaskOpen';
export const MaskClose = 'MaskClose';

export const CommonModalOpen = "CommonModalOpen";
export const CommonModalClose = "CommonModalClose";
export const CommonModalAction = "CommonModalAction";

export const InfoModalOpen = 'InfoModalOpen';
export const InfoModalClose = 'InfoModalClose';


//* 경고모달( ==> AlertModal.js 컴포넌트 ) 액션.
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

//* 앱 스와이프(좌, 우), 탭 클릭( ==> PageStack.js 컴포넌트 ) 액션.
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


//* 모달 생성 전 배경으로 깔리는 마스크( ==> Mask.js 컴포넌트 ) 액션.
export function mask_open() {
    return {
        type: MaskOpen,
    }
}
export function mask_close() {
    return {
        type: MaskClose,
    }
}


//* 정보 제공용( ==> CommonModal.js 컴포넌트 ) 모달 액션.
export function commonModal_open(title, text, subText, mood) {
    return{
        type: CommonModalOpen,
        title, text, subText, mood,
    }
}
export function commonModal_close() {
    return{
        type: CommonModalClose,
    }
}
export function commonModal_action() {
    return{
        type: CommonModalAction,
    }
}


//* 정산 세부내용( ==> SettleDetailModal.js 컴포넌트 ) 모달 액션.
export function infomodal_open(info) {
    return {
        type: InfoModalOpen,
        info,
    }
}
export function infomodal_close() {
    return {
        type: InfoModalClose,
    }
}