export default function mapStateToProps(state) {
  return {
    dims: state.dims,
    board: state.board,
    focusCell: state.focusCell,
  };
}
