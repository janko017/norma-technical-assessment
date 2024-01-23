import React, { useMemo } from "react";
import { AppBar, Button, IconButton, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Toolbar, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import * as FormTypes from "../types/formTypes";
import { TextFieldElement } from 'react-hook-form-mui'
import { Delete } from "@mui/icons-material";
import * as Calculations from "../helpers/calculations";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


export const Taxes: React.FC = () => {

    const validationSchema: yup.ObjectSchema<FormTypes.Taxes> = yup.object({
        rows: yup.array().of(yup.object({
            monthlySalary: yup.number().required().min(0),
            hourlyRate: yup.number().required().min(0), // Taux horaire
            dailyHours: yup.number().required().min(0).max(24).integer(), // Heures par jour
            daysByYear: yup.number().required().min(0).max(24).integer(), // Jours par années
            year: yup.number().required().min(1900).max(2100).integer()
        })).defined()
    })

    const { control, handleSubmit } = useForm<FormTypes.Taxes>({
        defaultValues: {
            rows: [],
        },
        resolver: yupResolver(validationSchema)
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "rows"
    })

    const onClickAppendRow = (worker: "Employee" | "Freelance") => {
        const rowToAdd = worker === "Employee"
            ? { monthlySalary: 0, year: 1900 } as FormTypes.PermanentTaxesRow // Cast pour ne pas avoir de conflit avec l'inteface
            : { hourlyRate: 0, dailyHours: 0, daysByYear: 0, year: 1900 } as FormTypes.PermanentTaxesRow;

        append(rowToAdd);
    }

    const rows = useWatch({
        control,
        name: "rows"
    })

    const total = useMemo(() => Calculations.getPermanentTaxesAnnualizedTotal(rows), [rows])
    const totalAfterTaxes = useMemo(() => Calculations.getPermanentTaxesAnnualizedTotalAfterTaxes(rows), [rows])

    return (
        <Stack>
            <AppBar>
                <Toolbar>
                    Calcul des taxes
                </Toolbar>
            </AppBar>
            <Toolbar />
            <Stack component="form" onSubmit={handleSubmit(() => {
                console.log("success");
            }, () => {
                console.log("error");
            })}
                marginTop={2}
                marginX={2}
                border={1}
                borderColor="lightgray"
                borderRadius={2}
                padding={2}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Salaire par mois</TableCell>
                                <TableCell>Taux horaire</TableCell>
                                <TableCell>Heures par jour</TableCell>
                                <TableCell>Jours par an</TableCell>
                                <TableCell>Année</TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>{
                            fields.map((field, index) =>
                                <TableRow key={field.id}>

                                    {/* Opération ternaires afin d'avoir les champs en fonction du revenu selectionné */}
                                    
                                    {field.monthlySalary !== undefined ? (
                                        <TableCell>
                                            <TextFieldElement control={control} name={`rows.${index}.monthlySalary`} InputProps={{
                                                endAdornment: <InputAdornment position="end"> €/ mois</InputAdornment>
                                            }} />
                                        </TableCell>
                                    ) : <TableCell/>}
                                    {field.hourlyRate !== undefined ? (
                                        <TableCell>
                                            <TextFieldElement control={control} name={`rows.${index}.hourlyRate`} InputProps={{
                                                endAdornment: <InputAdornment position="end"> €/ heure</InputAdornment>
                                            }} />
                                        </TableCell>
                                    ) : <TableCell/>}
                                    {field.dailyHours !== undefined ? (
                                        <TableCell>
                                            <TextFieldElement control={control} name={`rows.${index}.dailyHours`} InputProps={{ inputProps: { min: 1900 } }} />
                                        </TableCell>
                                    ) : <TableCell/>}
                                    {field.daysByYear !== undefined ? (
                                        <TableCell>
                                            <TextFieldElement control={control} name={`rows.${index}.daysByYear`} InputProps={{ inputProps: { min: 1900 } }} />
                                        </TableCell>
                                    ) : <TableCell/>}
                                    <TableCell>
                                        <TextFieldElement control={control} name={`rows.${index}.year`} InputProps={{ inputProps: { min: 1900 } }} />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => remove(index)}><Delete /></IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
                <Stack direction="row" justifyContent="center" spacing={2} marginY={2}>

                    {/* Opération onClick modifiée afin d'ajouter une nouvelle ligne en fonction d'un paramètre,
                    celles qui sont destinées aux cdi et celles qui sont destinées aux freelance */}

                    <Button onClick={() => onClickAppendRow("Employee")} sx={{ alignSelf: "center", marginTop: 2 }}>Ajouter un revenu de CDI</Button>
                    <Button onClick={() => onClickAppendRow("Freelance")} sx={{ alignSelf: "center", marginTop: 2 }}>Ajouter un revenu de Freelance</Button>
                </Stack>
                <Typography variant="h6">Total : {total} €</Typography>
                <Typography variant="h6">Total après taxes : {totalAfterTaxes} €</Typography>
            </Stack>
        </Stack >
    );
}