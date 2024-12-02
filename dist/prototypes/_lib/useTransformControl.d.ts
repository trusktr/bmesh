import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
export default function useTransformControl(tjs: any): {
    o: TransformControls;
    onRotate: null;
    onMove: null;
    onStart: null;
    onStop: null;
    attach: (o: any) => TransformControls;
    detach: () => void;
    toTranslate: () => void;
    toRotate: () => void;
    setPos: (p: any) => any;
    useAxes: (s?: number) => /*elided*/ any;
};
