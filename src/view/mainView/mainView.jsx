import ChartView from '../chartView/chartView';
import styles from './mainView.module.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function MainView() {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <ChartView />
      </DndProvider>
    </div>
  );
}
