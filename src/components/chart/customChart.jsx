import React, { useEffect, useRef, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useDrag, useDrop } from 'react-dnd';
import styles from './customChart.module.css';
import _ from 'lodash';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  animation: false,
  scales: {
    y: {
      ticks: {
        callback: function (value, index, values) {
          return value.toFixed(2);
        },
      },
    },
  },
};

export default function CustomChart({ id, data, setData, index, moveChart }) {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: 'chart',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveChart(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'chart',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const chartData = {
    labels: [...Array(data.data.length).keys()],
    datasets: [
      {
        data: data.data,
      },
    ],
  };

  // const rectRef = useRef(null);
  const rectRef = React.createRef();

  const throttleGrid = _.throttle((newGrid) => {
    setData((prev) => {
      const { column, row } = newGrid;
      const newData = { ...data, column: column, row: row };
      const newDatas = [...prev];
      newDatas[index] = newData;
      return newDatas;
    });
  }, 100);

  const [rect, setRect] = useState(null);

  useEffect(() => {
    const width = rectRef.current?.clientWidth;
    const height = rectRef.current?.clientHeight;
    console.log(width, height);
    setRect({ width, height });
  }, [data.row, data.column]);

  const [{ isResizing }, resizeRef] = useDrag(
    () => ({
      type: 'resize',
      item: {
        column: data && data.column,
        row: data && data.row,
        width: rect && rect.width,
        height: rect && rect.height,
        throttleGrid,
      },
      collect: (monitor) => ({
        isResizing: monitor.isDragging(),
      }),
    }),
    [data.row, data.column, rect, throttleGrid]
  );

  drag(drop(ref));

  return (
    <div
      ref={[ref, rectRef]}
      className={styles.container}
      style={{
        opacity: isDragging ? 0 : 1,
        gridColumn: data && `auto/span ${data.column}`,
        gridRow: data && `auto/span ${data.row}`,
        // minWidth: `100px`,
      }}
      data-handler-id={handlerId}
    >
      <Line data={chartData} options={options} />
      <div ref={resizeRef} className={styles.resizeHandle}></div>
    </div>
  );
}
