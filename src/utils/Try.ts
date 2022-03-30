const Try = <T, R>(attempt: () => T, onFailure: (reason: any) => R) => {
  try {
    var res = attempt();
  } catch (err) {
    return onFailure(err);
  }
  return res;
};

export default Try;
