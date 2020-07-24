import React from 'react';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import { Coordinate } from 'futoshiki/model/Board';
import LtSymbol from 'futoshiki/components/LtSymbol';

interface IProps {
    cellAbove: Coordinate;
}

export default function ColumnLtSymbol({ cellAbove }: IProps): JSX.Element {
    const cellBelow: Coordinate = {
        x: cellAbove.x,
        y: cellAbove.y + 1,
    };

    return (
        <LtSymbol className="col-lt"
            cell1={cellAbove}
            cell2={cellBelow}
            lessThan={<ExpandLess />}
            greaterThan={<ExpandMore />} />
    );
}
