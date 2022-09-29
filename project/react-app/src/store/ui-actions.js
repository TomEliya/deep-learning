import { uiActions } from './ui-slice';

let regularTimer;
let regularTimerDone = false;

export const realResult = () => {
  return dispatch => {
    if (regularTimer && !regularTimerDone) {
      return;
    }
    regularTimer = null;
    regularTimer = false;

    dispatch(uiActions.real());

    regularTimer = setTimeout(() => {
      dispatch(uiActions.regular());
      regularTimerDone = true;
    }, 2 * 1000);
  };
};

export const fakeResult = () => {
  return dispatch => {
    if (regularTimer && !regularTimerDone) {
      return;
    }
    regularTimer = null;
    regularTimer = false;

    dispatch(uiActions.fake());

    regularTimer = setTimeout(() => {
      dispatch(uiActions.regular());
      regularTimerDone = true;
    }, 2 * 1000);
  };
};
