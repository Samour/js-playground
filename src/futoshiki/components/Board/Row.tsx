import React from 'react';
import {
    Cell as CellModel,
} from 'futoshiki/model/Board';
import Cell from 'futoshiki/components/Cell';
import RowLtSymbol from './RowLtSymbol';

interface IProps {
    y: number;
    cells: CellModel[];
}

export default function Row({ y, cells }: IProps): JSX.Element {
    const elements = [];
    for (let x = 0; x < cells.length; x++) {
        if (x > 0) {
            elements.push(<RowLtSymbol key={x * 2} leftCell={{ x: x - 1, y }} />);
        }
        elements.push(<Cell key={x * 2 + 1} cell={cells[x]} x={x} y={y} />);
    }

    return (
        <div className="row">
            {elements}
        </div>
    );
}
