create table "public"."category" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "name" text not null,
    "imageUrl" text not null,
    "slug" text not null,
    "products" bigint[]
);


alter table "public"."category" enable row level security;

create table "public"."order" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "status" text not null,
    "description" text,
    "user" uuid not null,
    "slug" text not null,
    "totalPrice" double precision not null
);


alter table "public"."order" enable row level security;

create table "public"."order_item" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "product" bigint not null,
    "order" bigint not null,
    "quantity" bigint not null
);


alter table "public"."order_item" enable row level security;

create table "public"."product" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "title" text not null,
    "slug" text not null,
    "imagesUrl" text[] not null,
    "price" bigint not null,
    "heroImage" text not null,
    "category" bigint not null,
    "maxQuantity" bigint not null
);


alter table "public"."product" enable row level security;

create table "public"."users" (
    "id" uuid not null,
    "email" text not null,
    "type" text default 'USER'::text,
    "avatar_url" text not null,
    "created_at" timestamp without time zone default CURRENT_TIMESTAMP
);


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX category_name_key ON public.category USING btree (name);

CREATE UNIQUE INDEX category_pkey ON public.category USING btree (id);

CREATE UNIQUE INDEX order_item_pkey ON public.order_item USING btree (id);

CREATE UNIQUE INDEX order_pkey ON public."order" USING btree (id);

CREATE UNIQUE INDEX order_slug_key ON public."order" USING btree (slug);

CREATE UNIQUE INDEX product_pkey ON public.product USING btree (id);

CREATE UNIQUE INDEX product_slug_key ON public.product USING btree (slug);

CREATE UNIQUE INDEX product_title_key ON public.product USING btree (title);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."category" add constraint "category_pkey" PRIMARY KEY using index "category_pkey";

alter table "public"."order" add constraint "order_pkey" PRIMARY KEY using index "order_pkey";

alter table "public"."order_item" add constraint "order_item_pkey" PRIMARY KEY using index "order_item_pkey";

alter table "public"."product" add constraint "product_pkey" PRIMARY KEY using index "product_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."category" add constraint "category_name_key" UNIQUE using index "category_name_key";

alter table "public"."order" add constraint "order_slug_key" UNIQUE using index "order_slug_key";

alter table "public"."order" add constraint "order_user_fkey" FOREIGN KEY ("user") REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."order" validate constraint "order_user_fkey";

alter table "public"."order_item" add constraint "order_item_order_fkey" FOREIGN KEY ("order") REFERENCES "order"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."order_item" validate constraint "order_item_order_fkey";

alter table "public"."order_item" add constraint "order_item_product_fkey" FOREIGN KEY (product) REFERENCES product(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."order_item" validate constraint "order_item_product_fkey";

alter table "public"."product" add constraint "product_category_fkey" FOREIGN KEY (category) REFERENCES category(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."product" validate constraint "product_category_fkey";

alter table "public"."product" add constraint "product_slug_key" UNIQUE using index "product_slug_key";

alter table "public"."product" add constraint "product_title_key" UNIQUE using index "product_title_key";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."users" validate constraint "users_id_fkey";

alter table "public"."users" add constraint "users_type_check" CHECK ((type = ANY (ARRAY['USER'::text, 'ADMIN'::text]))) not valid;

alter table "public"."users" validate constraint "users_type_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.decrement_product_quantity(product_id bigint, quantity bigint)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE product
  SET "maxQuantity" = "maxQuantity" - quantity
  WHERE id = product_id AND "maxQuantity" >= quantity;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  if new.raw_user_meta_data->>'avatar_url' is null or new.raw_user_meta_data->>'avatar_url' = '' then
  new.raw_user_meta_data = jsonb_set(new.raw_user_meta_data, '{avatar_url}', '"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"' ::jsonb);
  end if;
  insert into public.users(id, email, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'avatar_url');
  return new;
end;

$function$
;

grant delete on table "public"."category" to "anon";

grant insert on table "public"."category" to "anon";

grant references on table "public"."category" to "anon";

grant select on table "public"."category" to "anon";

grant trigger on table "public"."category" to "anon";

grant truncate on table "public"."category" to "anon";

grant update on table "public"."category" to "anon";

grant delete on table "public"."category" to "authenticated";

grant insert on table "public"."category" to "authenticated";

grant references on table "public"."category" to "authenticated";

grant select on table "public"."category" to "authenticated";

grant trigger on table "public"."category" to "authenticated";

grant truncate on table "public"."category" to "authenticated";

grant update on table "public"."category" to "authenticated";

grant delete on table "public"."category" to "service_role";

grant insert on table "public"."category" to "service_role";

grant references on table "public"."category" to "service_role";

grant select on table "public"."category" to "service_role";

grant trigger on table "public"."category" to "service_role";

grant truncate on table "public"."category" to "service_role";

grant update on table "public"."category" to "service_role";

grant delete on table "public"."order" to "anon";

grant insert on table "public"."order" to "anon";

grant references on table "public"."order" to "anon";

grant select on table "public"."order" to "anon";

grant trigger on table "public"."order" to "anon";

grant truncate on table "public"."order" to "anon";

grant update on table "public"."order" to "anon";

grant delete on table "public"."order" to "authenticated";

grant insert on table "public"."order" to "authenticated";

grant references on table "public"."order" to "authenticated";

grant select on table "public"."order" to "authenticated";

grant trigger on table "public"."order" to "authenticated";

grant truncate on table "public"."order" to "authenticated";

grant update on table "public"."order" to "authenticated";

grant delete on table "public"."order" to "service_role";

grant insert on table "public"."order" to "service_role";

grant references on table "public"."order" to "service_role";

grant select on table "public"."order" to "service_role";

grant trigger on table "public"."order" to "service_role";

grant truncate on table "public"."order" to "service_role";

grant update on table "public"."order" to "service_role";

grant delete on table "public"."order_item" to "anon";

grant insert on table "public"."order_item" to "anon";

grant references on table "public"."order_item" to "anon";

grant select on table "public"."order_item" to "anon";

grant trigger on table "public"."order_item" to "anon";

grant truncate on table "public"."order_item" to "anon";

grant update on table "public"."order_item" to "anon";

grant delete on table "public"."order_item" to "authenticated";

grant insert on table "public"."order_item" to "authenticated";

grant references on table "public"."order_item" to "authenticated";

grant select on table "public"."order_item" to "authenticated";

grant trigger on table "public"."order_item" to "authenticated";

grant truncate on table "public"."order_item" to "authenticated";

grant update on table "public"."order_item" to "authenticated";

grant delete on table "public"."order_item" to "service_role";

grant insert on table "public"."order_item" to "service_role";

grant references on table "public"."order_item" to "service_role";

grant select on table "public"."order_item" to "service_role";

grant trigger on table "public"."order_item" to "service_role";

grant truncate on table "public"."order_item" to "service_role";

grant update on table "public"."order_item" to "service_role";

grant delete on table "public"."product" to "anon";

grant insert on table "public"."product" to "anon";

grant references on table "public"."product" to "anon";

grant select on table "public"."product" to "anon";

grant trigger on table "public"."product" to "anon";

grant truncate on table "public"."product" to "anon";

grant update on table "public"."product" to "anon";

grant delete on table "public"."product" to "authenticated";

grant insert on table "public"."product" to "authenticated";

grant references on table "public"."product" to "authenticated";

grant select on table "public"."product" to "authenticated";

grant trigger on table "public"."product" to "authenticated";

grant truncate on table "public"."product" to "authenticated";

grant update on table "public"."product" to "authenticated";

grant delete on table "public"."product" to "service_role";

grant insert on table "public"."product" to "service_role";

grant references on table "public"."product" to "service_role";

grant select on table "public"."product" to "service_role";

grant trigger on table "public"."product" to "service_role";

grant truncate on table "public"."product" to "service_role";

grant update on table "public"."product" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

create policy "Enable Insert for admin only"
on "public"."category"
as permissive
for insert
to authenticated
with check ((( SELECT users.type
   FROM users
  WHERE (users.id = auth.uid())) = 'ADMIN'::text));


create policy "Enable Update for admins only"
on "public"."category"
as permissive
for update
to authenticated
using ((( SELECT users.type
   FROM users
  WHERE (users.id = auth.uid())) = 'ADMIN'::text))
with check ((( SELECT users.type
   FROM users
  WHERE (users.id = auth.uid())) = 'ADMIN'::text));


create policy "Enable delete for admins only"
on "public"."category"
as permissive
for delete
to authenticated
using ((( SELECT users.type
   FROM users
  WHERE (users.id = auth.uid())) = 'ADMIN'::text));


create policy "Enable read access for all users"
on "public"."category"
as permissive
for select
to authenticated
using (true);


create policy "allow all operations for auth users"
on "public"."order"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "allow all operations for auth users"
on "public"."order_item"
as permissive
for all
to authenticated
using (true)
with check (true);


create policy "Enable delete for admins users"
on "public"."product"
as permissive
for delete
to authenticated
using ((( SELECT users.type
   FROM users
  WHERE (users.id = auth.uid())) = 'ADMIN'::text));


create policy "Enable insert for admins users only"
on "public"."product"
as permissive
for insert
to authenticated
with check ((( SELECT users.type
   FROM users
  WHERE (users.id = auth.uid())) = 'ADMIN'::text));


create policy "Enable read access for all users"
on "public"."product"
as permissive
for select
to authenticated
using (true);


create policy "Enable update for all users"
on "public"."product"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "Enable read access for all users"
on "public"."users"
as permissive
for select
to authenticated
using (true);


