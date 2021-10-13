import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';
import MQTT from 'sp-react-native-mqtt';
import uuid from 'react-native-uuid';

const MQTT_SERVER = 'broker.emqx.io';
const MQTT_PORT = 1883;
const MQTT_CLIENT_ID = uuid.v4();
const MQTT_TOPIC = '/NGAME/temp';

const Temperature = () => {
    // States
    const [client, setClient] = useState(null);
    const [tempObject, setTempObject] = useState(null);

    // Life Cycle
    useEffect(() => {
        initialMqtt();
    }, []);

    function initialMqtt() {
        MQTT.createClient({
            uri: `mqtt://${MQTT_SERVER}:${1883}`,
            MQTT_CLIENT_ID
        }).then((client) => {
            client.on('closed', () => {
                console.log('mqtt.event.closed');
            });

            client.on('error', (msg) => {
                console.log('mqtt.event.error', msg);
            });

            client.on('message', (msg) => {
                // console.log('mqtt.event.message', msg);

                const [tempAmbient, tempObject] = msg.data.split(' ');
                setTempObject(tempObject);
            });

            client.on('connect', () => {
                console.log('connected');
                client.subscribe(MQTT_TOPIC, 0);
                setClient(client);
            });

            client.connect();
        }).catch((error) => {
            console.log(error);
        });
    }

    // Entry Point
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text
                    style={{
                        fontFamily: 'Prompt-SemiBold',
                        fontSize: 50,
                        color: '#000'
                    }}
                >
                    อุณหภูมิ
                </Text>
            </View>

            <View style={styles.content}>
                <Text
                    style={{
                        fontFamily: 'Prompt-Regular',
                        fontSize: 124,
                        color: '#000'
                    }}
                >
                    {(tempObject) ? `${tempObject}` : '-'}
                </Text>
                <Text
                    style={{
                        fontFamily: 'Prompt-Regular',
                        fontSize: 44,
                        color: '#000'
                    }}
                >
                    °C
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default Temperature;