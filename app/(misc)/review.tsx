import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/data/supabase";
import { useWriteLocationInfo } from "@/data/useWriteLocationInfo";
import { useWriteReviews } from "@/data/useWriteReviews";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import {
  Button,
  Platform,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from "react-native";
import * as Yup from "yup";

async function getUserId() {
  const { data: user, error } = await supabase.auth.getUser();

  if (error) {
    console.error(error.message, "Using anon user");

    return null;
  }

  return user?.user.id;
}

const reviewSchema = Yup.object().shape({
  OpeningTime: Yup.date().required("The opening time is required!"),
  ClosingTime: Yup.date().required("The closing time is required!"),
  PaymentType: Yup.string().required("Please select a type!"),
  PriceHourly: Yup.number().moreThan(-1).required("Please input a price!"),
  ReviewText: Yup.string().required("You must write a review here!"),
});

export default function ReviewScreen() {
  const [showOpeningTimePicker, setShowOpeningTimePicker] = useState(false);
  const [showClosingTimePicker, setShowClosingTimePicker] = useState(false);

  const writeReviews = useWriteReviews();
  const writeLocationInfo = useWriteLocationInfo();
  const localParams = useLocalSearchParams();
  const locationID = localParams.locationID.toString();

  return (
    <Formik
      initialValues={{
        OpeningTime: new Date(new Date().setHours(0, 0, 0, 0)),
        ClosingTime: new Date(new Date().setHours(0, 0, 0, 0)),
        PaymentType: "Hourly",
        PriceHourly: 0,
        ReviewText: "",
      }}
      validationSchema={reviewSchema}
      onSubmit={(values, { resetForm }) => {
        console.log("call");
        writeLocationInfo.mutate({
          locationID: locationID,
          openTime: values.OpeningTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }),
          closingTime: values.ClosingTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }),
          paymentType: values.PaymentType,
          priceHourly: values.PriceHourly,
        });

        // this is messy but it works usestate was not working for some reason i think cuz of async api call
        getUserId().then((data) => {
          if (data === null) {
            writeReviews.mutate({
              userID: "0",
              reviewScore: 5,
              reviewText: values.ReviewText,
              locationID: locationID,
            });
          } else {
            writeReviews.mutate({
              userID: data,
              reviewScore: 5,
              reviewText: values.ReviewText,
              locationID: locationID,
            });
          }
        });

        resetForm();
        router.back();
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <SafeAreaView style={styles.test}>
          {/* // OPENING */}
          <Button
            title="change opening time"
            onPress={() => setShowOpeningTimePicker(true)}
          />
          <ThemedText>
            {" "}
            {values.OpeningTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}{" "}
          </ThemedText>
          {showOpeningTimePicker && (
            <DateTimePicker
              value={values.OpeningTime}
              mode="time"
              onChange={(event, selectedDate) => {
                setShowOpeningTimePicker(Platform.OS === "ios");
                if (selectedDate) {
                  setFieldValue("OpeningTime", selectedDate);
                }
              }}
            />
          )}
          {/* // CLOSING */}
          <Button
            title="change closing time"
            onPress={() => setShowClosingTimePicker(true)}
          />
          <ThemedText>
            {" "}
            {values.ClosingTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })}{" "}
          </ThemedText>
          {showClosingTimePicker && (
            <DateTimePicker
              value={values.ClosingTime}
              mode="time"
              onChange={(event, selectedDate) => {
                setShowClosingTimePicker(Platform.OS === "ios");
                if (selectedDate) {
                  setFieldValue("ClosingTime", selectedDate);
                }
              }}
            />
          )}
          {/* // PAYMENT TYPE */}
          <ThemedText>Payment Type</ThemedText>
          <Picker
            selectedValue={undefined}
            onValueChange={(itemValue) =>
              setFieldValue("PaymentType", itemValue)
            }
          >
            <Picker.Item label="Hourly" value="Hourly" />
            <Picker.Item label="Daily" value="Daily" />
            <Picker.Item label="Per Minute" value="Per Minute" />
          </Picker>
          {touched.PaymentType && errors.PaymentType && (
            <ThemedText style={styles.errorMsg}>
              {errors.PaymentType}
            </ThemedText>
          )}
          {/* // RATE */}
          <ThemedText>Rate</ThemedText>
          <TextInput
            value={values.PriceHourly.toString()}
            onChangeText={handleChange("PriceHourly")}
            onBlur={handleBlur("PriceHourly")}
            placeholder={undefined}
            inputMode="numeric"
          />
          {touched.PriceHourly && errors.PriceHourly && (
            <ThemedText style={styles.errorMsg}>
              {errors.PriceHourly}
            </ThemedText>
          )}
          {/* // REVIEW */}
          <ThemedText>Review</ThemedText>
          <TextInput
            value={values.ReviewText}
            onChangeText={handleChange("ReviewText")}
            onBlur={handleBlur("ReviewText")}
            placeholder="Review"
          />
          {touched.ReviewText && errors.ReviewText && (
            <ThemedText style={styles.errorMsg}>{errors.ReviewText}</ThemedText>
          )}

          <Button title="submit test" onPress={() => handleSubmit()}></Button>
        </SafeAreaView>
      )}
    </Formik>
  );
}

const styles = StyleSheet.create({
  test: {
    margin: 30,
  },
  errorMsg: {
    color: "#ff0000",
    marginHorizontal: 10,
  },
});
