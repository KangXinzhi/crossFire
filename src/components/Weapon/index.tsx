import {WeaponModel} from "../../model/WeaponModel";

export const Weapon = (props) => {
    return (
        <group {...props}>
            <WeaponModel />
        </group>
    );
}