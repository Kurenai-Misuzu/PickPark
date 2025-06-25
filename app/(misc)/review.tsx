import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { supabase } from "@/data/supabase";
import { useWriteLocationInfo } from "@/data/useWriteLocationInfo";
import { useWriteReviews } from "@/data/useWriteReviews";
import {
  Button,
  IndexPath,
  Input,
  Select,
  SelectItem,
} from "@ui-kitten/components";
import { router, useLocalSearchParams } from "expo-router";
import { Formik } from "formik";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
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
  const colorScheme = useColorScheme();
  const [showOpeningTimePicker, setShowOpeningTimePicker] = useState(false);
  const [showClosingTimePicker, setShowClosingTimePicker] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState<IndexPath>(new IndexPath(0));

  const paymentOptions = ["Hourly", "Daily", "Per Minute"];
  const displayValue = paymentOptions[selectedIndex.row];
  const writeReviews = useWriteReviews();
  const writeLocationInfo = useWriteLocationInfo();
  const localParams = useLocalSearchParams();
  const locationID = localParams.locationID.toString();

  return (
    <View style={{flex: 1, backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}}>
      <ThemedView style={[styles.header, {backgroundColor: colorScheme === "light" ? "white" : "#1a1b1e"}]}>
        <Button
          appearance="filled"
          onPress={() => router.back()}
          style={{ borderColor: "maroon", backgroundColor: "maroon" }}
        >
          Back
        </Button>
        <ThemedText
          type="title"
          style={{ verticalAlign: "middle", paddingLeft: 30, paddingTop: 15 }}
        >
          Write Review
        </ThemedText>
      </ThemedView>

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
          <View style={styles.pageInner}>
            <View style={styles.components}>
              {/* // OPENING */}
              <View style={styles.timeContainer}>
                <Button
                  style={styles.button}
                  appearance="filled"
                  onPress={() => setShowOpeningTimePicker(true)}
                >
                  Opening Time
                </Button>
                <ThemedText style={styles.time}>
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
              </View>

              {/* // CLOSING */}
              <View style={styles.timeContainer}>
                <Button
                  style={styles.button}
                  appearance="filled"
                  onPress={() => setShowClosingTimePicker(true)}
                >
                  Closing Time
                </Button>
                <ThemedText style={styles.time}>
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
              </View>
            </View>
            {/* // PAYMENT TYPE */}
            <View style={styles.components}>
              <ThemedText>Payment Type</ThemedText>
              <Select
                value={displayValue}
                selectedIndex={selectedIndex}
                onSelect={(index) => {
                  if (!Array.isArray(index)) {
                    setSelectedIndex(index);
                  }
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
              <ThemedText>Payment Rate (USD)</ThemedText>
              <Input
                value={undefined}
                onChangeText={handleChange("PriceHourly")}
                onBlur={handleBlur("PriceHourly")}
                placeholder={values.PriceHourly.toString()}
                inputMode="numeric"
              />
              {touched.PriceHourly && errors.PriceHourly && (
                <ThemedText style={styles.errorMsg}>
                  {errors.PriceHourly}
                </ThemedText>
              )}
            </View>
            {/* // REVIEW */}
            <View style={styles.components}>
              <ThemedText>Review</ThemedText>
              <Input
                textStyle={styles.reviewBox}
                multiline={true}
                value={values.ReviewText}
                onChangeText={handleChange("ReviewText")}
                onBlur={handleBlur("ReviewText")}
                placeholder="Message"
              />
              {touched.ReviewText && errors.ReviewText && (
                <ThemedText style={styles.errorMsg}>
                  {errors.ReviewText}
                </ThemedText>
              )}
            </View>
            <View style={styles.components}>
              <Button
                style={styles.button}
                appearance="filled"
                onPress={() => handleSubmit()}
              >
                Submit Review
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: "1%",
    marginTop: "15%",
    flexDirection: "row",
    verticalAlign: "middle",
    height: "7.5%",
    borderBottomColor: "maroon",
    borderBottomWidth: 2,
  },
  pageInner: {
    padding: 30,
    paddingTop: "5%",
    paddingBottom: "10%",
  },
  errorMsg: {
    color: "#ff0000",
    marginHorizontal: 10,
  },
  components: {
    marginVertical: 5,
  },
  timeContainer: {
    flexDirection: "row",
    margin: 1,
  },
  time: {
    alignItems: "flex-end",
    textAlign: "right",
    alignSelf: "center",
    marginLeft: "auto",
  },
  button: {
    borderColor: "maroon",
    backgroundColor: "maroon",
  },
  reviewBox: {
    minHeight: 64,
  },
});
