-- Table: public.employees

DROP TABLE IF EXISTS public.employees;

CREATE TABLE IF NOT EXISTS public.employees
(
    employee_id smallint NOT NULL,
    last_name character varying(20) COLLATE pg_catalog."default" NOT NULL,
    first_name character varying(10) COLLATE pg_catalog."default" NOT NULL,
    title character varying(30) COLLATE pg_catalog."default",
    title_of_courtesy character varying(25) COLLATE pg_catalog."default",
    birth_date date,
    hire_date date,
    address character varying(60) COLLATE pg_catalog."default",
    city character varying(15) COLLATE pg_catalog."default",
    region character varying(15) COLLATE pg_catalog."default",
    postal_code character varying(10) COLLATE pg_catalog."default",
    country character varying(15) COLLATE pg_catalog."default",
    home_phone character varying(24) COLLATE pg_catalog."default",
    extension character varying(4) COLLATE pg_catalog."default",
    photo bytea,
    notes text COLLATE pg_catalog."default",
    reports_to smallint,
    photo_path character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT pk_employees PRIMARY KEY (employee_id),
    CONSTRAINT fk_employees_employees FOREIGN KEY (reports_to)
    REFERENCES public.employees (employee_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
    )

    TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.employees
    OWNER to postgres;