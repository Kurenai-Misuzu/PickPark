import { ThemedText } from "@/components/ThemedText";
import { supabase } from "@/data/supabase";
import { useWriteLocationInfo } from "@/data/useWriteLocationInfo";
import { useWriteReviews } from "@/data/useWriteReviews";
import { IndexPath, Select, SelectItem } from "@ui-kitten/components";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { Button, SafeAreaView, StyleSheet, TextInput } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Yup from "yup";

// RED SQUIGGLYS ON ROW ARE OK. AT LEAST IT DOESN'T SEEM TO CAUSE ANY ERRORS

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

  const [selectedIndex, setSelectedIndex] = useState<IndexPath | IndexPath[]>(
    new IndexPath(0),
  );

  const paymentOptions = ["Hourly", "Daily", "Per Minute"];
  const displayValue = paymentOptions[selectedIndex.row];
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
          paymentType: paymentOptions[selectedIndex.row],
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
              hour12: true,
            })}{" "}
          </ThemedText>
          <DateTimePickerModal
            isVisible={showOpeningTimePicker}
            mode="time"
            onConfirm={(time) => {
              setFieldValue("OpeningTime", time);
              setShowOpeningTimePicker(false);
            }}
            onCancel={() => setShowOpeningTimePicker(false)}
          />
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
              hour12: true,
            })}{" "}
          </ThemedText>
          <DateTimePickerModal
            isVisible={showClosingTimePicker}
            mode="time"
            onConfirm={(time) => {
              setFieldValue("ClosingTime", time);
              setShowClosingTimePicker(false);
            }}
            onCancel={() => setShowClosingTimePicker(false)}
          />
          {/* // PAYMENT TYPE */}
          <ThemedText>Payment Type</ThemedText>
          <Select
            value={displayValue}
            selectedIndex={selectedIndex}
            onSelect={(index) => {
              setSelectedIndex(index);
            }}
          >
            <SelectItem title="Hourly" />
            <SelectItem title="Daily" />
            <SelectItem title="Per Minute" />
          </Select>
          {touched.PaymentType && errors.PaymentType && (
            <ThemedText style={styles.errorMsg}>
              {errors.PaymentType}
            </ThemedText>
          )}
          {/* // RATE */}
          <ThemedText>Payment Rate</ThemedText>
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

          <Button title="submit Review" onPress={() => handleSubmit()}></Button>
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
