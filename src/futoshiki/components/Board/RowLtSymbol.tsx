import React from 'react';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
import {
    Coordinate,
} from 'futoshiki/model/Board';
import LtSymbol from 'futoshiki/components/LtSymbol';

interface IProps {
    leftCell: Coordinate;
}

export default function RowLtSymbol({ leftCell }: IProps): JSX.Element {
    const rightCell: Coordinate = {
        x: leftCell.x + 1,
        y: leftCell.y,
    };

    return (
        <LtSymbol className="row-lt"
            cell1={leftCell}
            cell2={rightCell}
            lessThan={<ChevronLeft />}
            greaterThan={<ChevronRight />} />
    );
}
