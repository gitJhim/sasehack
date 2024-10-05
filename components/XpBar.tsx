import XpToLevel from './XpToLevel';
import {UserStore} from '../types/user.types'
import {View, Text, Image, StyleSheet} from 'react-native';
import * as Progress from 'react-native-progress';
import { useUserStore } from '../state/stores/userStore';


export default function TopBar(){
    const user = useUserStore((state) => state.user);
    if (!user || user.level == null || user.xp == null){
        return(
            <View>None</View>
        );
    }

    const xpNeeded = XpToLevel({ level: user.level, xp: user.xp});
    const progress = user.xp / xpNeeded;

    return(
        <View className="p-4">
                <View className="flex-row p-2 h-12 w-40 rounded-full items-center bg-[#B1ECC8]">
                    <Image source={require("../assets/kid_star.png")} alt="star" width={20} height={20}/>
                    <Text className="font-bold items-center text-lg"> Level: {user.level}</Text>
                </View>
                <View>
                    <Text className="font-semibold">exp</Text>
                    <Progress.Bar progress={progress} width={200} color="#B1ECC8"/>
                </View>
                <View className="">
                    <Text className="font-semibold">XP: {user.xp} / {xpNeeded}</Text>
                </View>
        </View>
    );
};
