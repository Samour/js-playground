export default function mapStateToProps(state) {
  return {
    dims: state.dims,
    gameMode: state.gameMode,
  };
}
