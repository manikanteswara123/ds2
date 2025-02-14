import {
  put,
  takeLatest,
  all,
  call,
  fork,
  getContext,
} from "redux-saga/effects";
import * as api from "controller/labelApi.js";
import {
  GET_LABELPROJECTS_REQUEST,
  GET_LABELPROJECTS_SUCCESS,
  GET_LABELPROJECTS_FAILURE,
  GET_RECENTLABELPROJECTS_REQUEST,
  GET_RECENTLABELPROJECTS_SUCCESS,
  GET_RECENTLABELPROJECTS_FAILURE,
  DELETE_LABELPROJECTS_REQUEST,
  DELETE_LABELPROJECTS_SUCCESS,
  DELETE_LABELPROJECTS_FAILURE,
  POST_LABELPROJECT_REQUEST,
  POST_LABELPROJECT_SUCCESS,
  POST_LABELPROJECT_FAILURE,
  GET_LABELPROJECT_REQUEST,
  GET_LABELPROJECT_SUCCESS,
  GET_LABELPROJECT_FAILURE,
  GET_OBJECTLISTS_REQUEST,
  GET_OBJECTLISTS_SUCCESS,
  GET_OBJECTLISTS_FAILURE,
  PUT_LABELPROJECT_REQUEST,
  PUT_LABELPROJECT_SUCCESS,
  PUT_LABELPROJECT_FAILURE,
  POST_LABELCLASS_REQUEST,
  POST_LABELCLASS_SUCCESS,
  POST_LABELCLASS_FAILURE,
  PUT_LABELCLASS_REQUEST,
  PUT_LABELCLASS_SUCCESS,
  PUT_LABELCLASS_FAILURE,
  DELETE_LABELCLASS_REQUEST,
  DELETE_LABELCLASS_SUCCESS,
  DELETE_LABELCLASS_FAILURE,
  POST_OBJECTLISTS_REQUEST,
  POST_OBJECTLISTS_SUCCESS,
  REQUEST_RESET_ISPOSTSUCCESS,
  POST_OBJECTLISTS_FAILURE,
  DELETE_OBJECTLISTS_REQUEST,
  DELETE_OBJECTLISTS_SUCCESS,
  DELETE_OBJECTLISTS_FAILURE,
  UPDATE_LABELSHAREGROUP_REQUEST,
  UPDATE_LABELSHAREGROUP_SUCCESS,
  UPDATE_LABELSHAREGROUP_FAILURE,
  POST_AITRAINERLABELPROJECT_REQUEST,
  POST_AITRAINERLABELPROJECT_SUCCESS,
  POST_AITRAINERLABELPROJECT_FAILURE,
  GET_AITRAINERLABELPROJECT_REQUEST,
  GET_AITRAINERLABELPROJECT_SUCCESS,
  GET_AITRAINERLABELPROJECT_FAILURE,
  GET_WORKAGE_REQEUST,
  GET_WORKAGE_SUCCESS,
  GET_WORKAGE_FAILURE,
  GET_LABELPROJECTASYNC_REQUEST,
  GET_LABELPROJECTASYNC_SUCCESS,
  GET_LABELPROJECTASYNC_FAILURE,
  GET_AUTOLABELSTATUS_REQUEST,
  GET_AUTOLABELSTATUS_SUCCESS,
  GET_AUTOLABELSTATUS_FAILURE,
  RESET_LABELPROJECTASYNC,
  GET_AUTOLABELCHART,
  GET_LABELCLASSES_REQUEST,
  GET_LABELCLASSES_SUCCESS,
  GET_LABELCLASSES_FAILURE,
} from "redux/reducers/labelprojects.js";
import {
  REQUEST_SUCCESS_MESSAGE,
  REQUEST_ERROR_MESSAGE,
  CLOSE_MODAL_CONTENT,
} from "redux/reducers/messages.js";
import { renderSnackbarMessage } from "components/Function/globalFunc";

function* getLabelProjects(action) {
  try {
    const result = yield api.getLabelProjects(action.data);
    yield put({
      type: GET_LABELPROJECTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        "죄송합니다. 일시적인 오류 발생으로 라벨링프로젝트 정보를 불러오는데 실패하였습니다."
      ),
    });
    yield put({
      type: GET_LABELPROJECTS_FAILURE,
    });
  }
}
function* watchGetLabelProjects() {
  yield takeLatest(GET_LABELPROJECTS_REQUEST, getLabelProjects);
}

function* getRecentLabelProjects(action) {
  try {
    const result = yield api.getLabelProjects(action.data);
    yield put({
      type: GET_RECENTLABELPROJECTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: GET_RECENTLABELPROJECTS_FAILURE,
    });
  }
}
function* WatchGetRecentLabelProjects() {
  yield takeLatest(GET_RECENTLABELPROJECTS_REQUEST, getRecentLabelProjects);
}

// function* getAiTrainerLabelproject(action) {
//   try {
//     const result = yield api.getAiTrainerLabelprojects(action.data);
//     yield put({
//       type: GET_AITRAINERLABELPROJECT_SUCCESS,
//       data: result.data,
//     });
//   } catch (err) {
//     yield put({
//       type: REQUEST_ERROR_MESSAGE,
//       data: err.response.data.message
//         ? err.response.data.message
//         : "죄송합니다. 일시적인 오류 발생으로 라벨링프로젝트 정보를 불러오는데 실패하였습니다.",
//     });
//     yield put({
//       type: GET_AITRAINERLABELPROJECT_FAILURE,
//     });
//   }
// }
// function* watchGetAiTrainerLabelproject() {
//   yield takeLatest(GET_AITRAINERLABELPROJECT_REQUEST, getAiTrainerLabelproject);
// }

function* deleteLabelProjects(action) {
  try {
    const result = yield api.deleteLabelProject(action.data.labelProjects);
    yield put({
      type: DELETE_LABELPROJECTS_SUCCESS,
      data: result.data.successList,
    });
    yield put({
      type: REQUEST_SUCCESS_MESSAGE,
      data: "프로젝트가 정상적으로 삭제되었습니다.",
    });
    if (action.data.sortInfo) {
      yield put({
        type: GET_LABELPROJECTS_REQUEST,
        data: action.data.sortInfo,
      });
      return;
    } else {
      const history = yield getContext("history");
      history.push(`/labelling?page=1&sorting=created_at&desc=true&rows=10`);
      return;
    }
  } catch (err) {
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        "죄송합니다. 프로젝트 삭제 중 오류가 발생하였습니다. 다시 시도해주세요."
      ),
    });
    yield put({
      type: DELETE_LABELPROJECTS_FAILURE,
    });
  }
}
function* watchDeleteLabelProjects() {
  yield takeLatest(DELETE_LABELPROJECTS_REQUEST, deleteLabelProjects);
}

function* postLabelProject(action) {
  if (action.data.filesForLabelProject) {
    try {
      const result = yield api.postLabelProjectsFromDataconnector({
        name: action.data.name,
        description: action.data.description,
        workapp: action.data.workapp,
        dataconnectors: action.data.files,
      });
      if (result) {
        try {
          yield put({
            type: POST_LABELPROJECT_SUCCESS,
            data: result.data,
          });
          yield put({
            type: CLOSE_MODAL_CONTENT,
          });
          yield put({
            type: REQUEST_SUCCESS_MESSAGE,
            data: "프로젝트가 정상적으로 생성되었습니다.",
          });
        } catch (err) {
          yield put({
            type: REQUEST_ERROR_MESSAGE,
            data: renderSnackbarMessage(
              "error",
              err.response,
              "죄송합니다. 파일 업로드 중 오류가 발생하였습니다. 다시 시도해주세요."
            ),
          });
          yield put({
            type: POST_LABELPROJECT_FAILURE,
          });
        }
      }
    } catch (err) {
      if (
        process.env.REACT_APP_ENTERPRISE !== "true" &&
        err.response &&
        err.response.status === 402
      ) {
        window.location.href = "/admin/setting/payment/?cardRequest=true";
        return;
      }
      yield put({
        type: REQUEST_ERROR_MESSAGE,
        data: renderSnackbarMessage(
          "error",
          err.response,
          "죄송합니다. 프로젝트 생성 중 오류가 발생하였습니다. 다시 시도해주세요."
        ),
      });
      yield put({
        type: POST_LABELPROJECT_FAILURE,
      });
    }
  } else {
    try {
      const result = yield api.postLabelProjects({
        name: action.data.name,
        description: action.data.description,
        workapp: action.data.workapp,
        files: action.data.files,
        frame_value: action.data.frame_value,
      });
      if (result) {
        try {
          yield put({
            type: POST_LABELPROJECT_SUCCESS,
            data: result.data,
          });
          yield put({
            type: CLOSE_MODAL_CONTENT,
          });
          yield put({
            type: REQUEST_SUCCESS_MESSAGE,
            data: "프로젝트가 정상적으로 생성되었습니다.",
          });
        } catch (err) {
          yield put({
            type: REQUEST_ERROR_MESSAGE,
            data: renderSnackbarMessage(
              "error",
              err.response,
              "죄송합니다. 파일 업로드 중 오류가 발생하였습니다. 다시 시도해주세요."
            ),
          });
          yield put({
            type: POST_LABELPROJECT_FAILURE,
          });
        }
      }
    } catch (err) {
      if (
        process.env.REACT_APP_ENTERPRISE !== "true" &&
        err.response &&
        err.response.status === 402
      ) {
        window.location.href = "/admin/setting/payment/?cardRequest=true";
        return;
      }
      yield put({
        type: REQUEST_ERROR_MESSAGE,
        data: renderSnackbarMessage(
          "error",
          err.response,
          "죄송합니다. 프로젝트 생성 중 오류가 발생하였습니다. 다시 시도해주세요."
        ),
      });
      yield put({
        type: POST_LABELPROJECT_FAILURE,
      });
    }
  }
}
function* watchPostLabelProject() {
  yield takeLatest(POST_LABELPROJECT_REQUEST, postLabelProject);
}

function* getObjectLists(action) {
  try {
    const result = yield api.getListObjects(action.data);
    yield put({
      type: GET_OBJECTLISTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        "죄송합니다. 일시적인 오류 발생으로 라벨링 파일 정보를 불러오는데 실패하였습니다."
      ),
    });
    yield put({
      type: GET_OBJECTLISTS_FAILURE,
    });
  }
}
function* watchGetObjectLists() {
  yield takeLatest(GET_OBJECTLISTS_REQUEST, getObjectLists);
}

function* getLabelProject(action) {
  try {
    const result = yield api.getLabelProject(action.data);
    yield put({
      type: GET_LABELPROJECT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        "죄송합니다. 일시적인 오류 발생으로 라벨링프로젝트 정보를 불러오는데 실패하였습니다."
      ),
    });
    yield put({
      type: GET_LABELPROJECT_FAILURE,
    });
  }
}
function* watchGetLabelProject() {
  yield takeLatest(GET_LABELPROJECT_REQUEST, getLabelProject);
}

function* getLabelclasses(action) {
  try {
    const result = yield api.getLabelClassesPerPage(action.data);
    yield put({
      type: GET_LABELCLASSES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        "클래스를 불러오는데 실패하였습니다."
      ),
    });
    yield put({
      type: GET_LABELCLASSES_FAILURE,
    });
  }
}
function* watchGetLabelclasses() {
  yield takeLatest(GET_LABELCLASSES_REQUEST, getLabelclasses);
}

function* putLabelProject(action) {
  try {
    const result = yield api.upldateLabelProject(
      action.data.id,
      action.data.data.params
    );
    yield put({
      type: PUT_LABELPROJECT_SUCCESS,
      data: action.data.data,
    });
    yield put({
      type: REQUEST_SUCCESS_MESSAGE,
      data: "프로젝트 정보가 정상적으로 변경되었습니다.",
    });
  } catch (err) {
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        "죄송합니다. 일시적인 오류 발생으로 프로젝트 정보 변경에 실패하였습니다."
      ),
    });
    yield put({
      type: PUT_LABELPROJECT_FAILURE,
    });
  }
}

function* watchputLabelProject() {
  yield takeLatest(PUT_LABELPROJECT_REQUEST, putLabelProject);
}

function* postLabelClass(action) {
  try {
    const result = yield api.postLabelClass(action.data);
    const labelClass = result.data;
    labelClass["isDeleted"] = null;
    labelClass["completedLabelCount"] = 0;

    yield put({
      type: POST_LABELCLASS_SUCCESS,
      data: labelClass,
    });
    yield put({
      type: CLOSE_MODAL_CONTENT,
    });
    yield put({
      type: REQUEST_SUCCESS_MESSAGE,
      data: action.data.isMarketProject
        ? "구역이 성공적으로 생성되었습니다."
        : "클래스가 성공적으로 생성되었습니다.",
    });
  } catch (err) {
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        action.data.isMarketProject
          ? "죄송합니다. 일시적인 오류로 구역 생성에 실패하였습니다."
          : "죄송합니다. 일시적인 오류로 클래스 생성에 실패하였습니다."
      ),
    });
    yield put({
      type: POST_LABELCLASS_FAILURE,
    });
  }
}
function* watchpostLabelClass() {
  yield takeLatest(POST_LABELCLASS_REQUEST, postLabelClass);
}

function* putLabelClass(action) {
  try {
    const result = yield api.updateLabelClass(
      action.data.labelClass,
      action.data.labelProjectId
    );
    const labelClass = result.data;
    labelClass["id"] = action.data.id;

    yield put({
      type: PUT_LABELCLASS_SUCCESS,
      data: labelClass,
    });
    yield put({
      type: CLOSE_MODAL_CONTENT,
    });
    yield put({
      type: GET_LABELPROJECT_REQUEST,
      data: action.data.labelProjectId,
    });
    yield put({
      type: REQUEST_SUCCESS_MESSAGE,
      data: "클래스가 정상적으로 변경되었습니다.",
    });
  } catch (err) {
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        "죄송합니다. 일시적인 오류로 클래스 변경에 실패하였습니다."
      ),
    });
    yield put({
      type: PUT_LABELCLASS_FAILURE,
    });
  }
}
function* watchputLabelClass() {
  yield takeLatest(PUT_LABELCLASS_REQUEST, putLabelClass);
}

function* deleteLabelClass(action) {
  try {
    const result = yield api.deleteLabelClass(action.data.arr, action.data.id);
    yield put({
      type: DELETE_LABELCLASS_SUCCESS,
      data: action.data,
    });
    yield put({
      type: GET_LABELPROJECT_REQUEST,
      data: action.data.id,
    });
    yield put({
      type: REQUEST_SUCCESS_MESSAGE,
      data: "클래스가 성공적으로 삭제되었습니다.",
    });
  } catch (err) {
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        "죄송합니다. 일시적인 오류로 라벨 삭제에 실패하였습니다."
      ),
    });
    yield put({
      type: DELETE_LABELCLASS_FAILURE,
    });
  }
}
function* watchDeleteLabelClass() {
  yield takeLatest(DELETE_LABELCLASS_REQUEST, deleteLabelClass);
}

function* postObjectLists(action) {
  try {
    const result = yield api.postUploadFile(
      action.data.files,
      action.data.labelprojectId,
      action.data.has_de_identification,
      action.data.frameValue
    );
    yield put({
      type: POST_OBJECTLISTS_SUCCESS,
      data: action.data,
    });
    yield put({
      type: REQUEST_SUCCESS_MESSAGE,
      data:
        "데이터 업로드가 시작되었습니다. 파일의 형태나 용량에 따라 소요되는 시간이 다를 수 있으며, 알림내역에서 작업 상태를 확인 가능합니다.",
    });
    yield put({
      type: REQUEST_RESET_ISPOSTSUCCESS,
    });
  } catch (err) {
    yield put({
      type: POST_OBJECTLISTS_FAILURE,
      data: action.data.sortingInfo,
    });
    yield put({
      type: GET_OBJECTLISTS_REQUEST,
      data: action.data.sortingInfo,
    });
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        "죄송합니다. 일시적인 오류로 파일 등록에 실패하였습니다. 다시 시도해주세요."
      ),
    });
  }
}
function* watchPostObjectLists() {
  yield takeLatest(POST_OBJECTLISTS_REQUEST, postObjectLists);
}

function* deleteObjectLists(action) {
  try {
    const result = yield api.deleteLabelFile(action.data.file);
    yield put({
      type: DELETE_OBJECTLISTS_SUCCESS,
      data: result.data.successList,
    });
    yield put({
      type: REQUEST_SUCCESS_MESSAGE,
      data: "파일이 성공적으로 삭제되었습니다.",
    });
    yield put({
      type: GET_OBJECTLISTS_REQUEST,
      data: action.data.sortingInfo,
    });
  } catch (err) {
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        "죄송합니다. 일시적인 오류로 파일 삭제에 실패하였습니다."
      ),
    });
    yield put({
      type: DELETE_OBJECTLISTS_FAILURE,
    });
  }
}
function* watchDeleteObjectLists() {
  yield takeLatest(DELETE_OBJECTLISTS_REQUEST, deleteObjectLists);
}

function* updateLabelShareGroup(action) {
  try {
    const result = yield api.updateShareGroup(action.data);
    yield put({
      type: REQUEST_SUCCESS_MESSAGE,
      data: action.data.isUpdate
        ? "라벨프로젝트 공유를 하였습니다."
        : "라벨프로젝트 공유를 취소했습니다.",
    });
    yield put({
      type: UPDATE_LABELSHAREGROUP_SUCCESS,
      data: result.data.sharedgroup,
    });
  } catch (err) {
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        "죄송합니다. 일시적인 오류가 발생하였습니다. 다시 시도해주세요."
      ),
    });
    yield put({
      type: UPDATE_LABELSHAREGROUP_FAILURE,
    });
  }
}
function* watchUpdateLabelShareGroup() {
  yield takeLatest(UPDATE_LABELSHAREGROUP_REQUEST, updateLabelShareGroup);
}

function* postAiTrainerLabelproject(action) {
  try {
    const result = yield api.shareToAiTrainer(
      action.data.labelId,
      action.data.isshared
    );
    yield put({
      type: REQUEST_SUCCESS_MESSAGE,
      data: action.data.isshared
        ? "라벨프로젝트 공유를 하였습니다."
        : "라벨프로젝트 공유를 취소했습니다.",
    });
    yield put({
      type: POST_AITRAINERLABELPROJECT_SUCCESS,
      data: result.data.shareaitrainer,
    });
  } catch (err) {
    yield put({
      type: REQUEST_ERROR_MESSAGE,
      data: renderSnackbarMessage(
        "error",
        err.response,
        "죄송합니다. 일시적인 오류가 발생하였습니다. 다시 시도해주세요."
      ),
    });
    yield put({
      type: POST_AITRAINERLABELPROJECT_FAILURE,
    });
  }
}
function* watchPostAiTrainerLabelproject() {
  yield takeLatest(
    POST_AITRAINERLABELPROJECT_REQUEST,
    postAiTrainerLabelproject
  );
}

function* getWorkage(action) {
  try {
    const result = yield api.getWorkage(action.data);
    yield put({
      type: GET_WORKAGE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: GET_WORKAGE_FAILURE,
    });
  }
}
function* watchGetWorkage() {
  yield takeLatest(GET_WORKAGE_REQEUST, getWorkage);
}

function* getLabelProjectAsync(action) {
  try {
    const result = yield api.getLabelProject(action.data);
    yield put({
      type: GET_LABELPROJECTASYNC_SUCCESS,
      data: result.data,
    });
    yield put({
      type: GET_AUTOLABELSTATUS_REQUEST,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: GET_LABELPROJECTASYNC_FAILURE,
    });
  }
}
function* watchGetLabelProjectAsync() {
  yield takeLatest(GET_LABELPROJECTASYNC_REQUEST, getLabelProjectAsync);
}

function* getAutoLabelStatus(action) {
  try {
    const result = yield api.getAutolabelStatus(action.data);
    if (result.data.image_s3_url === "done") {
      yield put({
        type: GET_AUTOLABELCHART,
        data: result.data,
      });
      // yield put({
      //   type: RESET_LABELPROJECTASYNC,
      // });
      return;
    } else {
      yield put({
        type: GET_AUTOLABELSTATUS_SUCCESS,
        data: result.data,
      });
      yield put({
        type: GET_AUTOLABELCHART,
        data: result.data,
      });
    }
  } catch (err) {
    yield put({
      type: GET_AUTOLABELSTATUS_FAILURE,
    });
  }
}
function* watchGetAutoLabelStatus() {
  yield takeLatest(GET_AUTOLABELSTATUS_REQUEST, getAutoLabelStatus);
}

export default function* labelprojectsSaga() {
  yield all([
    fork(watchGetLabelProjects),
    fork(WatchGetRecentLabelProjects),
    // fork(watchGetAiTrainerLabelproject),
    fork(watchDeleteLabelProjects),
    fork(watchPostLabelProject),
    fork(watchGetLabelProject),
    fork(watchGetLabelclasses),
    fork(watchGetObjectLists),
    fork(watchputLabelProject),
    fork(watchpostLabelClass),
    fork(watchputLabelClass),
    fork(watchDeleteLabelClass),
    fork(watchPostObjectLists),
    fork(watchDeleteObjectLists),
    fork(watchUpdateLabelShareGroup),
    fork(watchPostAiTrainerLabelproject),
    fork(watchGetWorkage),
    fork(watchGetLabelProjectAsync),
    fork(watchGetAutoLabelStatus),
  ]);
}
