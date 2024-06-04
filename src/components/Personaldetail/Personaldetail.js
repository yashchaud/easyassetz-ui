import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm, Controller, useWatch } from "react-hook-form";
import axios from "axios";
import { Label } from "@com/ui/label";
import { Input } from "@com/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@com/ui/select";
import { Button } from "@com/ui/button";
import { PopoverTrigger, PopoverContent, Popover } from "@com/ui/popover";
import { Calendar } from "@com/ui/calendar";
import { RadioGroupItem, RadioGroup } from "@com/ui/radio-group";
import { Checkbox } from "@com/ui/checkbox";
import Datepicker from "./Datepicker";

const Personaldetail = () => {
  const [showAdharFields, setShowAdharFields] = useState(false);
  const [showPANFields, setShowPANFields] = useState(false);
  const [showDLFields, setShowDLFields] = useState(false);
  const [showPassportFields, setShowPassportFields] = useState(false);
  const [isForeign, setIsForeign] = useState(false);
  const [sameAsLoginEmail, setSameAsLoginEmail] = useState(true);
  const [sameAsPermanentAddress, setSameAsPermanentAddress] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      adhar: "no",
      pan: "no",
      drivingLicense: "no",
      passport: "no",
      dob: null,
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  const permanentAddress = watch([
    "permanentHouseFlatNo",
    "permanentAddressLine1",
    "permanentAddressLine2",
    "permanentPincode",
    "permanentCity",
    "permanentState",
    "permanentCountry",
  ]);

  useEffect(() => {
    if (sameAsPermanentAddress) {
      setValue("currentHouseFlatNo", permanentAddress[0]);
      setValue("currentAddressLine1", permanentAddress[1]);
      setValue("currentAddressLine2", permanentAddress[2]);
      setValue("currentPincode", permanentAddress[3]);
      setValue("currentCity", permanentAddress[4]);
      setValue("currentState", permanentAddress[5]);
      setValue("currentCountry", permanentAddress[6]);
    }
  }, [sameAsPermanentAddress, permanentAddress, setValue]);

  const handlePincodeChange = async (pincode) => {
    try {
      const response = await axios.get(
        `https://api.example.com/pincode/${pincode}`
      );
      const { city, state, country } = response.data;

      setValue("permanentCity", city);
      setValue("permanentState", state);
      setValue("permanentCountry", country);
    } catch (error) {
      console.error("Failed to fetch pincode details:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Personal Details</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <div className="space-y-2">
          <Label htmlFor="full-name">Full Legal Name</Label>
          <Input
            id="full-name"
            placeholder="John Doe"
            type="text"
            {...register("fullName", {
              required: "Full Legal Name is required",
            })}
          />
          {errors.fullName && (
            <span className="text-red-500">{errors.fullName.message}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Controller
            name="gender"
            control={control}
            rules={{ required: "Gender is required" }}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && (
            <span className="text-red-500">{errors.gender.message}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <Controller
            name="dob"
            control={control}
            render={({ field }) => (
              <Datepicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.dob && (
            <span className="text-red-500">{errors.dob.message}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <div className="flex items-center gap-4">
            <Controller
              name="nationality"
              control={control}
              rules={{ required: "Nationality is required" }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setIsForeign(value === "foreign");
                  }}
                >
                  <Label
                    className="flex items-center gap-2"
                    htmlFor="nationality-indian"
                  >
                    <RadioGroupItem id="nationality-indian" value="indian" />
                    Indian
                  </Label>
                  <Label
                    className="flex items-center gap-2"
                    htmlFor="nationality-foreign"
                  >
                    <RadioGroupItem id="nationality-foreign" value="foreign" />
                    Foreign
                  </Label>
                </RadioGroup>
              )}
            />
            {errors.nationality && (
              <span className="text-red-500">{errors.nationality.message}</span>
            )}
            {isForeign && (
              <Controller
                name="specificNationality"
                control={control}
                rules={{ required: isForeign }}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                    className="ml-4"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="afghan">Afghan</SelectItem>
                      <SelectItem value="argentine">Argentine</SelectItem>
                      <SelectItem value="australian">Australian</SelectItem>
                      <SelectItem value="austrian">Austrian</SelectItem>
                      <SelectItem value="bangladeshi">Bangladeshi</SelectItem>
                      <SelectItem value="belgian">Belgian</SelectItem>
                      <SelectItem value="brazilian">Brazilian</SelectItem>
                      <SelectItem value="british">British</SelectItem>
                      <SelectItem value="canadian">Canadian</SelectItem>
                      <SelectItem value="chilean">Chilean</SelectItem>
                      <SelectItem value="colombian">Colombian</SelectItem>
                      <SelectItem value="costa-rican">Costa Rican</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country of Residence</Label>
          <Controller
            name="country"
            control={control}
            rules={{ required: "Country of Residence is required" }}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="au">Australia</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.country && (
            <span className="text-red-500">{errors.country.message}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="religion">Religion</Label>
          <Controller
            name="religion"
            control={control}
            rules={{ required: "Religion is required" }}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="christian">Christianity</SelectItem>
                  <SelectItem value="islam">Islam</SelectItem>
                  <SelectItem value="Muslim">muslim</SelectItem>
                  <SelectItem value="Jain">Jain</SelectItem>
                  <SelectItem value="Sikh">Sikh</SelectItem>
                  <SelectItem value="hinduism">Hinduism</SelectItem>
                  <SelectItem value="buddhism">Buddhism</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.religion && (
            <span className="text-red-500">{errors.religion.message}</span>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="marital-status">Marital Status</Label>
          <Controller
            name="maritalStatus"
            control={control}
            rules={{ required: "Marital Status is required" }}
            render={({ field }) => (
              <Select
                {...field}
                onValueChange={(value) => field.onChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="divorced">Divorced</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.maritalStatus && (
            <span className="text-red-500">{errors.maritalStatus.message}</span>
          )}
        </div>
        <div className="space-y-2 mt-6 gap-2 flex items-center">
          <Checkbox
            className="mt-2"
            id="married-under-act"
            {...register("marriedUnderAct")}
          />
          <Label
            className="flex items-center gap-2 mt-2"
            htmlFor="married-under-act"
          >
            Married under Special Marriage Act
          </Label>
        </div>
        <div className="space-y-2">
          <Label htmlFor="correspondence-email">Correspondence Email</Label>
          <Controller
            name="correspondenceEmail"
            control={control}
            render={({ field }) => (
              <RadioGroup
                {...field}
                onValueChange={(value) => {
                  field.onChange(value);
                  setSameAsLoginEmail(value === "same");
                }}
              >
                <div className="flex items-center gap-4">
                  <Label
                    className="flex items-center gap-2"
                    htmlFor="email-same"
                  >
                    Same as your login ID
                  </Label>
                  <Label
                    className="flex items-center gap-2"
                    htmlFor="email-same"
                  >
                    Yes
                    <RadioGroupItem id="email-same" value="same" />
                  </Label>
                  <Label
                    className="flex items-center gap-2"
                    htmlFor="email-different"
                  >
                    No
                    <RadioGroupItem id="email-different" value="different" />
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
          {!sameAsLoginEmail && (
            <div className="space-y-2 mt-2">
              <Label htmlFor="custom-email">Custom Email</Label>
              <Input
                id="custom-email"
                placeholder="example@email.com"
                type="email"
                {...register("customEmail", {
                  required: !sameAsLoginEmail && "Custom Email is required",
                })}
              />
              {errors.customEmail && (
                <span className="text-red-500">
                  {errors.customEmail.message}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Permanent Address Section */}
        <div className="col-span-full space-y-4">
          <h2 className="text-2xl font-bold">Permanent Address</h2>
          <div className="space-y-2">
            <Label htmlFor="permanent-house-flat-no">House / Flat No.</Label>
            <Input
              id="permanent-house-flat-no"
              placeholder="House / Flat No."
              type="text"
              {...register("permanentHouseFlatNo", {
                required: "House / Flat No. is required",
              })}
            />
            {errors.permanentHouseFlatNo && (
              <span className="text-red-500">
                {errors.permanentHouseFlatNo.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanent-address-line-1">Address Line 1</Label>
            <Input
              id="permanent-address-line-1"
              placeholder="Address Line 1"
              type="text"
              {...register("permanentAddressLine1", {
                required: "Address Line 1 is required",
              })}
            />
            {errors.permanentAddressLine1 && (
              <span className="text-red-500">
                {errors.permanentAddressLine1.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanent-address-line-2">Address Line 2</Label>
            <Input
              id="permanent-address-line-2"
              placeholder="Address Line 2"
              type="text"
              {...register("permanentAddressLine2", {
                required: "Address Line 2 is required",
              })}
            />
            {errors.permanentAddressLine2 && (
              <span className="text-red-500">
                {errors.permanentAddressLine2.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanent-pincode">Pincode</Label>
            <Input
              id="permanent-pincode"
              placeholder="Pincode"
              type="text"
              {...register("permanentPincode", {
                required: "Pincode is required",
                onChange: (e) => handlePincodeChange(e.target.value),
              })}
            />
            {errors.permanentPincode && (
              <span className="text-red-500">
                {errors.permanentPincode.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanent-city">City</Label>
            <Input
              id="permanent-city"
              placeholder="City"
              type="text"
              {...register("permanentCity", { required: "City is required" })}
            />
            {errors.permanentCity && (
              <span className="text-red-500">
                {errors.permanentCity.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanent-state">State</Label>
            <Input
              id="permanent-state"
              placeholder="State"
              type="text"
              {...register("permanentState", {
                required: "State is required",
              })}
            />
            {errors.permanentState && (
              <span className="text-red-500">
                {errors.permanentState.message}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="permanent-country">Country</Label>
            <Input
              id="permanent-country"
              placeholder="Country"
              type="text"
              {...register("permanentCountry", {
                required: "Country is required",
              })}
            />
            {errors.permanentCountry && (
              <span className="text-red-500">
                {errors.permanentCountry.message}
              </span>
            )}
          </div>
        </div>

        {/* Current Address Section */}
        <div className="col-span-full space-y-4">
          <h2 className="text-2xl font-bold">Current Address</h2>
          <Label
            className="flex items-center gap-2 mt-2"
            htmlFor="same-as-permanent"
          >
            Same as Permanent Address
          </Label>

          <Checkbox
            id="same-as-permanent"
            checked={sameAsPermanentAddress}
            onCheckedChange={() =>
              setSameAsPermanentAddress(!sameAsPermanentAddress)
            }
            {...register("sameAsPermanentAddress")}
          />

          {!sameAsPermanentAddress && (
            <>
              <div className="space-y-2">
                <Label htmlFor="current-house-flat-no">House / Flat No.</Label>
                <Input
                  id="current-house-flat-no"
                  placeholder="House / Flat No."
                  type="text"
                  {...register("currentHouseFlatNo", {
                    required: "House / Flat No. is required",
                  })}
                />
                {errors.currentHouseFlatNo && (
                  <span className="text-red-500">
                    {errors.currentHouseFlatNo.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-address-line-1">Address Line 1</Label>
                <Input
                  id="current-address-line-1"
                  placeholder="Address Line 1"
                  type="text"
                  {...register("currentAddressLine1", {
                    required: "Address Line 1 is required",
                  })}
                />
                {errors.currentAddressLine1 && (
                  <span className="text-red-500">
                    {errors.currentAddressLine1.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-address-line-2">Address Line 2</Label>
                <Input
                  id="current-address-line-2"
                  placeholder="Address Line 2"
                  type="text"
                  {...register("currentAddressLine2", {
                    required: "Address Line 2 is required",
                  })}
                />
                {errors.currentAddressLine2 && (
                  <span className="text-red-500">
                    {errors.currentAddressLine2.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-pincode">Pincode</Label>
                <Input
                  id="current-pincode"
                  placeholder="Pincode"
                  type="text"
                  {...register("currentPincode", {
                    required: "Pincode is required",
                    onChange: (e) => handlePincodeChange(e.target.value),
                  })}
                />
                {errors.currentPincode && (
                  <span className="text-red-500">
                    {errors.currentPincode.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-city">City</Label>
                <Input
                  id="current-city"
                  placeholder="City"
                  type="text"
                  {...register("currentCity", {
                    required: "City is required",
                  })}
                />
                {errors.currentCity && (
                  <span className="text-red-500">
                    {errors.currentCity.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-state">State</Label>
                <Input
                  id="current-state"
                  placeholder="State"
                  type="text"
                  {...register("currentState", {
                    required: "State is required",
                  })}
                />
                {errors.currentState && (
                  <span className="text-red-500">
                    {errors.currentState.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="current-country">Country</Label>
                <Input
                  id="current-country"
                  placeholder="Country"
                  type="text"
                  {...register("currentCountry", {
                    required: "Country is required",
                  })}
                />
                {errors.currentCountry && (
                  <span className="text-red-500">
                    {errors.currentCountry.message}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Adhar Section */}
        <div className="col-span-full space-y-4">
          <h2 className="text-2xl font-bold">Adhar</h2>
          <div className="space-y-2">
            <Label htmlFor="adhar">Do you have an Adhar?</Label>
            <Controller
              name="adhar"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowAdharFields(value === "yes");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="adhar-yes"
                    >
                      <RadioGroupItem
                        defaultValue="no"
                        id="adhar-yes"
                        value="yes"
                      />
                      Yes
                    </Label>
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="adhar-no"
                    >
                      <RadioGroupItem
                        checked={showAdharFields === false}
                        id="adhar-no"
                        defaultValue="no"
                        value="no"
                      />
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.adhar && (
              <span className="text-red-500">{errors.adhar.message}</span>
            )}
          </div>
          {showAdharFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="adhar-number">Adhar Number</Label>
                <Input
                  id="adhar-number"
                  placeholder="Adhar Number"
                  type="text"
                  {...register("adharNumber", {
                    required: "Adhar Number is required",
                  })}
                />
                {errors.adharNumber && (
                  <span className="text-red-500">
                    {errors.adharNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="adhar-name">
                  Full Name - Name as per Adhar
                </Label>
                <Input
                  id="adhar-name"
                  placeholder="Full Name - Name as per Adhar"
                  type="text"
                  {...register("adharName", {
                    required: "Full Name is required",
                  })}
                />
                {errors.adharName && (
                  <span className="text-red-500">
                    {errors.adharName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="adhar-file">Upload File</Label>
                <Input
                  id="adhar-file"
                  type="file"
                  {...register("adharFile", {
                    required: "File upload is required",
                  })}
                />
                {errors.adharFile && (
                  <span className="text-red-500">
                    {errors.adharFile.message}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* PAN Section */}
        <div className="col-span-full space-y-4">
          <h2 className="text-2xl font-bold">PAN</h2>
          <div className="space-y-2">
            <Label htmlFor="pan">Do you have a PAN?</Label>
            <Controller
              name="pan"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowPANFields(value === "yes");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="pan-yes"
                    >
                      <RadioGroupItem id="pan-yes" value="yes" />
                      Yes
                    </Label>
                    <Label className="flex items-center gap-2" htmlFor="pan-no">
                      <RadioGroupItem
                        checked={showPANFields === false}
                        id="pan-no"
                        value="no"
                      />
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.pan && (
              <span className="text-red-500">{errors.pan.message}</span>
            )}
          </div>
          {showPANFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pan-number">PAN Number</Label>
                <Input
                  id="pan-number"
                  placeholder="PAN Number"
                  type="text"
                  {...register("panNumber", {
                    required: "PAN Number is required",
                  })}
                />
                {errors.panNumber && (
                  <span className="text-red-500">
                    {errors.panNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan-name">Full Name - Name as per PAN</Label>
                <Input
                  id="pan-name"
                  placeholder="Full Name - Name as per PAN"
                  type="text"
                  {...register("panName", {
                    required: "Full Name is required",
                  })}
                />
                {errors.panName && (
                  <span className="text-red-500">{errors.panName.message}</span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan-file">Upload File</Label>
                <Input
                  id="pan-file"
                  type="file"
                  {...register("panFile", {
                    required: "File upload is required",
                  })}
                />
                {errors.panFile && (
                  <span className="text-red-500">{errors.panFile.message}</span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Driving License Section */}
        <div className="col-span-full space-y-4">
          <h2 className="text-2xl font-bold">Driving License</h2>
          <div className="space-y-2">
            <Label htmlFor="driving-license">
              Do you have a Driving License?
            </Label>
            <Controller
              name="drivingLicense"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowDLFields(value === "yes");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="driving-license-yes"
                    >
                      <RadioGroupItem id="driving-license-yes" value="yes" />
                      Yes
                    </Label>
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="driving-license-no"
                    >
                      <RadioGroupItem
                        checked={showDLFields === false}
                        id="driving-license-no"
                        value="no"
                      />
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.drivingLicense && (
              <span className="text-red-500">
                {errors.drivingLicense.message}
              </span>
            )}
          </div>
          {showDLFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="driving-license-number">DL Number</Label>
                <Input
                  id="driving-license-number"
                  placeholder="DL Number"
                  type="text"
                  {...register("drivingLicenseNumber", {
                    required: "DL Number is required",
                  })}
                />
                {errors.drivingLicenseNumber && (
                  <span className="text-red-500">
                    {errors.drivingLicenseNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="driving-license-name">Name as per DL</Label>
                <Input
                  id="driving-license-name"
                  placeholder="Name as per DL"
                  type="text"
                  {...register("drivingLicenseName", {
                    required: "Name as per DL is required",
                  })}
                />
                {errors.drivingLicenseName && (
                  <span className="text-red-500">
                    {errors.drivingLicenseName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="driving-license-expiry">Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="flex-col items-start w-full h-auto"
                      variant="outline"
                    >
                      <span className="font-semibold uppercase text-[0.65rem]">
                        Expiry Date
                      </span>
                      <span className="font-normal">4/2/2024</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 max-w-[276px]">
                    <Calendar />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="driving-license-place">Place of issue</Label>
                <Input
                  id="driving-license-place"
                  placeholder="Place of issue"
                  type="text"
                  {...register("drivingLicensePlace", {
                    required: "Place of issue is required",
                  })}
                />
                {errors.drivingLicensePlace && (
                  <span className="text-red-500">
                    {errors.drivingLicensePlace.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="driving-license-file">Upload File</Label>
                <Input
                  id="driving-license-file"
                  type="file"
                  {...register("drivingLicenseFile", {
                    required: "File upload is required",
                  })}
                />
                {errors.drivingLicenseFile && (
                  <span className="text-red-500">
                    {errors.drivingLicenseFile.message}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Passport Section */}
        <div className="col-span-full space-y-4">
          <h2 className="text-2xl font-bold">Passport</h2>
          <div className="space-y-2">
            <Label htmlFor="passport">Do you have a Passport?</Label>
            <Controller
              name="passport"
              control={control}
              rules={{ required: "This field is required" }}
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);
                    setShowPassportFields(value === "yes");
                  }}
                >
                  <div className="flex items-center gap-4">
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="passport-yes"
                    >
                      <RadioGroupItem id="passport-yes" value="yes" />
                      Yes
                    </Label>
                    <Label
                      className="flex items-center gap-2"
                      htmlFor="passport-no"
                    >
                      <RadioGroupItem
                        checked={showPassportFields === false}
                        id="passport-no"
                        value="no"
                      />
                      No
                    </Label>
                  </div>
                </RadioGroup>
              )}
            />
            {errors.passport && (
              <span className="text-red-500">{errors.passport.message}</span>
            )}
          </div>
          {showPassportFields && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pp-number">PP Number</Label>
                <Input
                  id="pp-number"
                  placeholder="PP Number"
                  type="text"
                  {...register("passportNumber", {
                    required: "Passport Number is required",
                  })}
                />
                {errors.passportNumber && (
                  <span className="text-red-500">
                    {errors.passportNumber.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pp-name">Name as per PP</Label>
                <Input
                  id="pp-name"
                  placeholder="Name as per PP"
                  type="text"
                  {...register("passportName", {
                    required: "Name as per Passport is required",
                  })}
                />
                {errors.passportName && (
                  <span className="text-red-500">
                    {errors.passportName.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pp-expiry">Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="flex-col items-start w-full h-auto"
                      variant="outline"
                    >
                      <span className="font-semibold uppercase text-[0.65rem]">
                        Expiry Date
                      </span>
                      <span className="font-normal">4/2/2024</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 max-w-[276px]">
                    <Calendar />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pp-place">Place of issue</Label>
                <Input
                  id="pp-place"
                  placeholder="Place of issue"
                  type="text"
                  {...register("passportPlace", {
                    required: "Place of issue is required",
                  })}
                />
                {errors.passportPlace && (
                  <span className="text-red-500">
                    {errors.passportPlace.message}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pp-file">Upload File</Label>
                <Input
                  id="pp-file"
                  type="file"
                  {...register("passportFile", {
                    required: "File upload is required",
                  })}
                />
                {errors.passportFile && (
                  <span className="text-red-500">
                    {errors.passportFile.message}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        <div className="col-span-full flex justify-end">
          <Button className="w-full max-w-[200px]" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Personaldetail;
