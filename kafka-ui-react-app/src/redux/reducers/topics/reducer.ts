import { v4 } from 'uuid';
import { Topic } from 'generated-sources';
import { Action, TopicsState } from 'redux/interfaces';
import ActionType from 'redux/actionType';

export const initialState: TopicsState = {
  byName: {},
  allNames: [],
  messages: [],
};

const updateTopicList = (state: TopicsState, payload: Topic[]): TopicsState => {
  const initialMemo: TopicsState = {
    ...state,
    allNames: [],
  };

  return payload.reduce(
    (memo: TopicsState, topic) => ({
      ...memo,
      byName: {
        ...memo.byName,
        [topic.name]: {
          ...memo.byName[topic.name],
          ...topic,
          id: v4(),
        },
      },
      allNames: [...memo.allNames, topic.name],
    }),
    initialMemo
  );
};

const addToTopicList = (state: TopicsState, payload: Topic): TopicsState => {
  const newState: TopicsState = {
    ...state,
  };
  newState.allNames.push(payload.name);
  newState.byName[payload.name] = { ...payload, id: v4() };
  return newState;
};

const reducer = (state = initialState, action: Action): TopicsState => {
  switch (action.type) {
    case ActionType.GET_TOPICS__SUCCESS:
      return updateTopicList(state, action.payload);
    case ActionType.GET_TOPIC_DETAILS__SUCCESS:
      return {
        ...state,
        byName: {
          ...state.byName,
          [action.payload.topicName]: {
            ...state.byName[action.payload.topicName],
            ...action.payload.details,
          },
        },
      };
    case ActionType.GET_TOPIC_MESSAGES__SUCCESS:
      return {
        ...state,
        messages: action.payload,
      };
    case ActionType.GET_TOPIC_CONFIG__SUCCESS:
      return {
        ...state,
        byName: {
          ...state.byName,
          [action.payload.topicName]: {
            ...state.byName[action.payload.topicName],
            config: action.payload.config.map((inputConfig) => ({
              ...inputConfig,
              id: v4(),
            })),
          },
        },
      };
    case ActionType.POST_TOPIC__SUCCESS:
      return addToTopicList(state, action.payload);
    default:
      return state;
  }
};

export default reducer;
