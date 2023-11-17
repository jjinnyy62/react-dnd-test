import { useState } from 'react';
import CustomChart from '../../components/chart/customChart';
import styles from './chartView.module.css';
import { useDrop } from 'react-dnd';

export default function ChartView() {
  const [datas, setDatas] = useState([
    {
      id: 1,
      data: [1, 2, 3, 4, 5],
      column: 4,
      row: 3,
    },
    {
      id: 2,
      data: [4, 3, 1, 6, 1],
      column: 4,
      row: 3,
    },
    {
      id: 3,
      data: [3, 3, 3, 3, 3],
      column: 4,
      row: 3,
    },
    {
      id: 4,
      data: [1, 2, 3, 4, 5],
      column: 4,
      row: 3,
    },
    {
      id: 5,
      data: [1, 2, 3, 4, 5],
      column: 4,
      row: 3,
    },
  ]);

  const moveChart = (dragIndex, hoverIndex) => {
    setDatas((prev) => {
      const newData = [...prev];
      const dragData = newData[dragIndex];
      const hoverData = newData[hoverIndex];

      newData[dragIndex] = hoverData;
      newData[hoverIndex] = dragData;

      return newData;
    });
  };

  const [, resizeDrop] = useDrop(
    () => ({
      accept: 'resize',
      canDrop: () => false,
      hover(item, monitor) {
        const { column, row, width, height, throttleGrid } = monitor.getItem();
        const { x, y } = monitor.getDifferenceFromInitialOffset();

        let [newColumn, newRow] = [column, row];

        const [wPerColumn, hPerRow] = [width / column, height / row];

        newColumn += Math.round(x / wPerColumn);
        newRow += Math.round(y / hPerRow);

        newColumn > 10 && (newColumn = 10);
        newRow > 10 && (newRow = 10);

        if (newColumn !== column || newRow !== row) {
          throttleGrid(newColumn, newRow);
        }
      },
    }),
    []
  );

  return (
    <div ref={resizeDrop} className={styles.grid}>
      {datas.map((data, index) => (
        <CustomChart
          key={data.id}
          data={data}
          setData={setDatas}
          id={data.id}
          index={index}
          moveChart={moveChart}
        />
      ))}
    </div>
  );
}
