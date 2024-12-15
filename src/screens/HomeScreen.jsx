import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, TextInput } from 'react-native';
import IntegralInput from '../components/IntegralInput';
import { calculateIntegral } from '../utils/mathUtils';

export default function HomeScreen() {

    // initialize state
    const [isDefinite, setIsDefinite] = useState(false);
    const [functionExpression, setFunctionExpression] = useState('');
    const [lowerLimit, setLowerLimit] = useState('');
    const [upperLimit, setUpperLimit] = useState('');
    const [loading, setLoading] = useState(false);
    const [steps, setSteps] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);

    const handleCalculate = async () => {
        setLoading(true);
        try {

            // limit input validation for definite integrals
            if (isDefinite && (isNaN(lowerLimit) || isNaN(upperLimit))) {
                Alert.alert('Error', 'Batas bawah dan batas atas harus berupa angka');
                setLoading(false);
                return;
            }

            if (parseFloat(lowerLimit) >= parseFloat(upperLimit)) {
                Alert.alert('Error', 'Batas bawah harus lebih kecil dari batas atas');
                setLoading(false);
                return;
            }

            const stepsResult = await calculateIntegral(
                functionExpression,
                isDefinite,
                lowerLimit,
                upperLimit
            );

            setSteps(stepsResult);
            setCurrentStep(0);

        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleNextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (

        <View style={styles.container}>
            <Image source={require('../../assets/math.png')} style={styles.logo} />
            <Text style={styles.title}>Integral Ease</Text>

            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, isDefinite && styles.activeToggle]}
                    onPress={() => setIsDefinite(true)}
                >
                    <Text style={[styles.toggleText, isDefinite && styles.activeText]}>Tentu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, !isDefinite && styles.activeToggle]}
                    onPress={() => setIsDefinite(false)}
                >
                    <Text style={[styles.toggleText, !isDefinite && styles.activeText]}>Tak Tentu</Text>
                </TouchableOpacity>
            </View>

            <IntegralInput
                value={functionExpression}
                onChange={setFunctionExpression}
                placeholder="Masukkan fungsi (contoh: x^2)"
            />
            {isDefinite && (
                <View style={styles.limitsContainer}>
                    <TextInput
                        style={styles.input}
                        value={lowerLimit}
                        onChangeText={setLowerLimit}
                        keyboardType="numeric"
                        placeholder="Masukkan batas bawah"
                    />
                    <TextInput
                        style={styles.input}
                        value={upperLimit}
                        onChangeText={setUpperLimit}
                        keyboardType="numeric"
                        placeholder="Masukkan batas atas"
                    />
                </View>
            )}

            {/* display loader when calculating */}
            {loading ? (
                <ActivityIndicator size="large" color="#f9a825" />
            ) : (
                <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
                    <Text style={styles.calculateText}>Hitung</Text>
                </TouchableOpacity>
            )}

            {/* displays the calculation steps */}
            {steps.length > 0 && (
                <View style={styles.stepsContainer}>
                    <Text style={styles.stepText}>Langkah {currentStep + 1}: {steps[currentStep]}</Text>
                    <View style={styles.navigationButtons}>
                        {currentStep > 0 && (
                            <TouchableOpacity style={styles.prevButton} onPress={handlePreviousStep}>
                                <Text style={styles.prevButtonText}>Langkah Sebelumnya</Text>
                            </TouchableOpacity>
                        )}
                        {currentStep < steps.length - 1 && (
                            <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                                <Text style={styles.nextButtonText}>Langkah Selanjutnya</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#3d3d3d',
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        borderRadius: 30,
        marginBottom: 30,
        padding: 5,
    },
    toggleButton: {
        paddingVertical: 12,
        paddingHorizontal: 35,
        borderRadius: 25,
    },
    activeToggle: {
        backgroundColor: '#f33',
    },
    toggleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3d3d3d',
    },
    activeText: {
        color: '#ffffff',
    },
    limitsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 20,
    },
    input: {
        width: '48%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    calculateButton: {
        backgroundColor: '#f9a825',
        paddingVertical: 12,
        paddingHorizontal: 60,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    calculateText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    stepsContainer: {
        marginTop: 30,
        alignItems: 'center',
    },
    stepText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#333',
        marginBottom: 10,
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    nextButton: {
        backgroundColor: '#f9a825',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 10,
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
    prevButton: {
        backgroundColor: '#f9a825',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 30,
        marginTop: 10,
    },
    prevButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
    },
});
