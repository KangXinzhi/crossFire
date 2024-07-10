import { useEffect, useState } from "react";

type Movement = {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
}

type Keys = {
    [key: string]: keyof Movement;
}

const usePersonControls = () => {
    const keys: Keys = {
        KeyW: "forward",
        KeyS: "backward",
        KeyA: "left",
        KeyD: "right",
        Space: "jump"
    }

    const moveFieldByKey = (key: string): keyof Movement | undefined => keys[key];

    const [movement, setMovement] = useState<Movement>({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false
    });

    const setMovementStatus = (code: keyof Movement | undefined, status: boolean) => {
        code && setMovement((m) => ({...m, [code]: status}))
    }

    useEffect(() => {
        const handleKeyDown = (ev: KeyboardEvent) => {
            setMovementStatus(moveFieldByKey(ev.code), true);
        }

        const handleKeyUp = (ev: KeyboardEvent) => {
            setMovementStatus(moveFieldByKey(ev.code), false);
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        }
    }, []);

    return movement;
}

export default usePersonControls;